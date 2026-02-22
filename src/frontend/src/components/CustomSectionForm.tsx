import { useState, useEffect } from 'react';
import { useAddContentSection, useUpdateContentSection } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import type { ContentSection } from '../backend';

interface CustomSectionFormProps {
  section?: ContentSection | null;
  onClose: () => void;
}

export default function CustomSectionForm({ section, onClose }: CustomSectionFormProps) {
  const addMutation = useAddContentSection();
  const updateMutation = useUpdateContentSection();

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title,
        content: section.content
      });
      if (section.image) {
        setImagePreview(section.image.getDirectURL());
      }
    }
  }, [section]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let image = section?.image;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        image = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const contentSection: ContentSection = {
        id: section?.id || Date.now().toString(),
        title: formData.title,
        content: formData.content,
        image
      };

      if (section) {
        await updateMutation.mutateAsync(contentSection);
        toast.success('Section updated successfully!');
      } else {
        await addMutation.mutateAsync(contentSection);
        toast.success('Section added successfully!');
      }

      setUploadProgress(0);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${section ? 'update' : 'add'} section`);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <Button variant="ghost" className="mb-8" onClick={onClose}>
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{section ? 'Edit Section' : 'Add Section'}</CardTitle>
          <CardDescription>
            {section ? 'Update section details' : 'Create a new custom section'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="image">Section Image (Optional)</Label>
              <div className="mt-2 flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
                )}
                <div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                      <Upload size={16} />
                      <span>Upload Image</span>
                    </div>
                  </Label>
                </div>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Section title"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Section content..."
                rows={10}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={addMutation.isPending || updateMutation.isPending}
            >
              {addMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : section
                ? 'Update Section'
                : 'Add Section'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
