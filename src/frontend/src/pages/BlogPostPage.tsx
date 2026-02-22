import { useGetBlogPosts } from '../hooks/useQueries';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPostPage() {
  const { postId } = useParams({ from: '/blog/$postId' });
  const { data: posts, isLoading } = useGetBlogPosts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-48 mb-8" />
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const post = posts?.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <Link to="/blog">
          <Button>
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const imageUrl = post.featuredImage?.getDirectURL();
  const date = new Date(Number(post.publicationDate) / 1000000);

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <Link to="/blog">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Blog
        </Button>
      </Link>

      <article className="animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">{post.title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground mb-8">
          <Calendar size={16} />
          <time>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>

        {imageUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={imageUrl} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
