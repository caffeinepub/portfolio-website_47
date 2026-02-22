import { useGetAchievements } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AchievementsSection() {
  const { data: achievements, isLoading } = useGetAchievements();

  if (isLoading) {
    return (
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!achievements || achievements.length === 0) return null;

  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Achievements & Awards</h2>
          <p className="text-lg text-muted-foreground">Recognition for excellence and innovation</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const imageUrl = achievement.image?.getDirectURL() || '/assets/generated/achievement-placeholder.dim_600x400.png';
            const date = new Date(Number(achievement.date) / 1000000);

            return (
              <Card
                key={achievement.id}
                className="overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={imageUrl} alt={achievement.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-primary/90 p-2 rounded-full">
                    <Trophy className="text-primary-foreground" size={24} />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                  <CardDescription>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
