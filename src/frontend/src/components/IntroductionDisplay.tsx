import { useGetIntroduction } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function IntroductionDisplay() {
  const { data: intro, isLoading } = useGetIntroduction();

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Skeleton className="w-full aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!intro) return null;

  const imageUrl = intro.profileImage?.getDirectURL() || '/assets/generated/profile-picture.dim_400x400.png';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-scale-in">
            <img
              src={imageUrl}
              alt={intro.name}
              className="w-full aspect-square object-cover rounded-3xl shadow-card-hover"
            />
          </div>
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">{intro.name}</h2>
            <p className="text-xl text-primary font-semibold">{intro.title}</p>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {intro.bio.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
