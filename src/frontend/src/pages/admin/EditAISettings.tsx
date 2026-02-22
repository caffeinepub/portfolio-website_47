import { useState, useEffect } from 'react';
import { useGetFullAiSettings, useUpdateAiSettings } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { AISettings } from '../../backend';

export default function EditAISettings() {
  const { data: settings, isLoading } = useGetFullAiSettings();
  const updateMutation = useUpdateAiSettings();

  const [formData, setFormData] = useState({
    botName: '',
    initialGreeting: '',
    salesforceApiKey: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (settings) {
      setFormData({
        botName: settings.botName,
        initialGreeting: settings.initialGreeting,
        salesforceApiKey: settings.salesforceApiKey
      });
      if (settings.avatarImage) {
        setImagePreview(settings.avatarImage.getDirectURL());
      }
    }
  }, [settings]);

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
      let avatarImage = settings?.avatarImage;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        avatarImage = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const updatedSettings: AISettings = {
        botName: formData.botName,
        initialGreeting: formData.initialGreeting,
        salesforceApiKey: formData.salesforceApiKey,
        avatarImage
      };

      await updateMutation.mutateAsync(updatedSettings);
      toast.success('AI settings updated successfully!');
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to update AI settings');
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
          <CardTitle>AI Assistant Settings</CardTitle>
          <CardDescription>Configure your AI chatbot name, avatar, and Salesforce integration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="image">Avatar Image</Label>
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
                      <span>Upload Avatar</span>
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
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                value={formData.botName}
                onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                placeholder="AI Assistant"
                required
              />
            </div>

            <div>
              <Label htmlFor="initialGreeting">Initial Greeting</Label>
              <Textarea
                id="initialGreeting"
                value={formData.initialGreeting}
                onChange={(e) => setFormData({ ...formData, initialGreeting: e.target.value })}
                placeholder="Hi, How can I help you?"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="salesforceApiKey">Salesforce API Key</Label>
              <Input
                id="salesforceApiKey"
                type="password"
                value={formData.salesforceApiKey}
                onChange={(e) => setFormData({ ...formData, salesforceApiKey: e.target.value })}
                placeholder="Enter Salesforce Agentforce API key"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This key will be used to integrate with Salesforce Agentforce for AI responses
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
