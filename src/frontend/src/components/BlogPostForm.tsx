import { useState, useEffect } from 'react';
import { useAddBlogPost, useUpdateBlogPost } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import type { BlogPost } from '../backend';

interface BlogPostFormProps {
  post?: BlogPost | null;
  onClose: () => void;
}

export default function BlogPostForm({ post, onClose }: BlogPostFormProps) {
  const addMutation = useAddBlogPost();
  const updateMutation = useUpdateBlogPost();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    publicationDate: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (post) {
      const date = new Date(Number(post.publicationDate) / 1000000);
      setFormData({
        title: post.title,
        content: post.content,
        publicationDate: date.toISOString().split('T')[0]
      });
      if (post.featuredImage) {
        setImagePreview(post.featuredImage.getDirectURL());
      }
    } else {
      setFormData({
        title: '',
        content: '',
        publicationDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [post]);

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
      let featuredImage = post?.featuredImage;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        featuredImage = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const blogPost: BlogPost = {
        id: post?.id || Date.now().toString(),
        title: formData.title,
        content: formData.content,
        publicationDate: BigInt(new Date(formData.publicationDate).getTime() * 1000000),
        featuredImage
      };

      if (post) {
        await updateMutation.mutateAsync(blogPost);
        toast.success('Blog post updated successfully!');
      } else {
        await addMutation.mutateAsync(blogPost);
        toast.success('Blog post added successfully!');
      }

      setUploadProgress(0);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${post ? 'update' : 'add'} blog post`);
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
          <CardTitle>{post ? 'Edit Blog Post' : 'Add Blog Post'}</CardTitle>
          <CardDescription>
            {post ? 'Update blog post details' : 'Create a new blog post'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="image">Featured Image</Label>
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
                placeholder="Blog post title"
                required
              />
            </div>

            <div>
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="date"
                value={formData.publicationDate}
                onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content..."
                rows={15}
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
                : post
                ? 'Update Post'
                : 'Publish Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
