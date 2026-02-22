import { useState, useEffect } from 'react';
import { useGetIntroduction, useUpdateIntroduction } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { IntroductionSection } from '../../backend';

export default function EditIntroduction() {
  const { data: intro, isLoading } = useGetIntroduction();
  const updateMutation = useUpdateIntroduction();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (intro) {
      setFormData({
        name: intro.name,
        title: intro.title,
        bio: intro.bio
      });
      if (intro.profileImage) {
        setImagePreview(intro.profileImage.getDirectURL());
      }
    }
  }, [intro]);

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
      let profileImage = intro?.profileImage;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        profileImage = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const updatedIntro: IntroductionSection = {
        id: intro?.id || 'intro',
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        profileImage
      };

      await updateMutation.mutateAsync(updatedIntro);
      toast.success('Introduction updated successfully!');
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to update introduction');
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <Link to="/admin">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Introduction</CardTitle>
          <CardDescription>Update your profile information and bio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="image">Profile Picture</Label>
              <div className="mt-2 flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Your professional title"
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Your professional bio..."
                rows={10}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
