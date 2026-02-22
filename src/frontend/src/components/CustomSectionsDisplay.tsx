import { useGetContentSections } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomSectionsDisplay() {
  const { data: sections, isLoading } = useGetContentSections();

  if (isLoading || !sections || sections.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          {sections.map((section, index) => {
            const imageUrl = section.image?.getDirectURL();

            return (
              <Card
                key={section.id}
                className="overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {imageUrl && (
                  <div className="h-64 overflow-hidden">
                    <img src={imageUrl} alt={section.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-3xl text-gradient">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
