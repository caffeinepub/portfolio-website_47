import { useState, useEffect } from 'react';
import { useGetCmsSettings, useUpdateCmsSettings } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import type { CMSSettings } from '../../backend';

export default function CMSSettings() {
  const { data: settings, isLoading } = useGetCmsSettings();
  const updateMutation = useUpdateCmsSettings();

  const [formData, setFormData] = useState({
    theme: '',
    layoutOptions: '',
    customSectionOrder: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme,
        layoutOptions: settings.layoutOptions,
        customSectionOrder: settings.customSectionOrder.join(', ')
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedSettings: CMSSettings = {
        theme: formData.theme,
        layoutOptions: formData.layoutOptions,
        customSectionOrder: formData.customSectionOrder
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
      };

      await updateMutation.mutateAsync(updatedSettings);
      toast.success('CMS settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update CMS settings');
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
          <CardTitle>CMS Settings</CardTitle>
          <CardDescription>Configure site theme, layout, and content ordering</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="default, modern, minimal, etc."
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Theme identifier for styling customization
              </p>
            </div>

            <div>
              <Label htmlFor="layoutOptions">Layout Options</Label>
              <Input
                id="layoutOptions"
                value={formData.layoutOptions}
                onChange={(e) => setFormData({ ...formData, layoutOptions: e.target.value })}
                placeholder="standard, wide, compact, etc."
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Layout configuration for page structure
              </p>
            </div>

            <div>
              <Label htmlFor="customSectionOrder">Custom Section Order</Label>
              <Input
                id="customSectionOrder"
                value={formData.customSectionOrder}
                onChange={(e) => setFormData({ ...formData, customSectionOrder: e.target.value })}
                placeholder="section1, section2, section3"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Comma-separated list of section IDs to control display order
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
