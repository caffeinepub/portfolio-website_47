import { useState, useEffect } from 'react';
import { useAddAchievement, useUpdateAchievement } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import type { Achievement } from '../backend';

interface AchievementFormProps {
  achievement?: Achievement | null;
  onClose: () => void;
}

export default function AchievementForm({ achievement, onClose }: AchievementFormProps) {
  const addMutation = useAddAchievement();
  const updateMutation = useUpdateAchievement();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (achievement) {
      const date = new Date(Number(achievement.date) / 1000000);
      setFormData({
        title: achievement.title,
        description: achievement.description,
        date: date.toISOString().split('T')[0]
      });
      if (achievement.image) {
        setImagePreview(achievement.image.getDirectURL());
      }
    }
  }, [achievement]);

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
      let image = achievement?.image;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        image = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const achievementData: Achievement = {
        id: achievement?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: BigInt(new Date(formData.date).getTime() * 1000000),
        image
      };

      if (achievement) {
        await updateMutation.mutateAsync(achievementData);
        toast.success('Achievement updated successfully!');
      } else {
        await addMutation.mutateAsync(achievementData);
        toast.success('Achievement added successfully!');
      }

      setUploadProgress(0);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${achievement ? 'update' : 'add'} achievement`);
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
          <CardTitle>{achievement ? 'Edit Achievement' : 'Add Achievement'}</CardTitle>
          <CardDescription>
            {achievement ? 'Update achievement details' : 'Add a new achievement to showcase'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="image">Achievement Image</Label>
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
                placeholder="Achievement title"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the achievement..."
                rows={5}
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
                : achievement
                ? 'Update Achievement'
                : 'Add Achievement'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
