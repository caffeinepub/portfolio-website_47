import { useGetBlogPosts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Calendar, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPage() {
  const { data: posts, isLoading } = useGetBlogPosts();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Skeleton className="h-12 w-64 mb-12" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">Insights, tutorials, and thoughts on Salesforce and technology</p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const imageUrl = post.featuredImage?.getDirectURL();
            const date = new Date(Number(post.publicationDate) / 1000000);
            const excerpt = post.content.substring(0, 200) + '...';

            return (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar size={14} />
                    {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{excerpt}</p>
                  <Button 
                    variant="ghost" 
                    className="group"
                    onClick={() => navigate({ to: '/blog/$postId', params: { postId: post.id } })}
                  >
                    Read More
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
