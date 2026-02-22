import { useGetContactForms } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactSubmissions() {
  const { data: forms, isLoading } = useGetContactForms();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <Link to="/admin">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <h1 className="text-4xl font-bold text-gradient mb-8">Contact Submissions</h1>

      {!forms || forms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No contact submissions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => {
            const date = new Date(Number(form.timestamp) / 1000000);

            return (
              <Card key={form.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Mail size={20} className="text-primary" />
                        {form.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar size={14} />
                        {date.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </div>
                    {form.salesforceId && (
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        Synced to Salesforce
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{form.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Message</p>
                      <p className="text-sm">{form.message}</p>
                    </div>
                    {form.salesforceId && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Salesforce ID</p>
                        <p className="text-sm font-mono">{form.salesforceId}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
