import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsAdmin } from '../../hooks/useQueries';
import { useGetSiteStats } from '../../hooks/useQueries';
import { 
  User, 
  Award, 
  FileText, 
  MessageSquare, 
  Settings, 
  Bot, 
  Layout,
  Mail,
  BarChart
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: stats, isLoading: statsLoading } = useGetSiteStats();

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Skeleton className="h-12 w-64 mb-12" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  const adminLinks = [
    {
      title: 'Edit Introduction',
      description: 'Update profile information and bio',
      icon: User,
      path: '/admin/introduction',
      color: 'text-primary'
    },
    {
      title: 'Manage Achievements',
      description: 'Add, edit, or remove achievements',
      icon: Award,
      path: '/admin/achievements',
      color: 'text-secondary'
    },
    {
      title: 'Manage Blog Posts',
      description: 'Create and manage blog content',
      icon: FileText,
      path: '/admin/blog',
      color: 'text-tertiary'
    },
    {
      title: 'AI Assistant Settings',
      description: 'Configure chatbot name and avatar',
      icon: Bot,
      path: '/admin/ai-settings',
      color: 'text-primary'
    },
    {
      title: 'Custom Sections',
      description: 'Add custom content sections',
      icon: Layout,
      path: '/admin/custom-sections',
      color: 'text-secondary'
    },
    {
      title: 'Contact Submissions',
      description: 'View contact form submissions',
      icon: Mail,
      path: '/admin/contacts',
      color: 'text-tertiary'
    },
    {
      title: 'CMS Settings',
      description: 'Configure site theme and layout',
      icon: Settings,
      path: '/admin/cms-settings',
      color: 'text-primary'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage your portfolio content and settings</p>
      </div>

      {/* Stats */}
      {!statsLoading && stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(stats.totalMessages)}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(stats.totalAchievements)}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(stats.totalBlogPosts)}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <BarChart className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(stats.totalVisits)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Links */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link, index) => (
          <Link key={link.path} to={link.path}>
            <Card
              className="hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-accent ${link.color}`}>
                    <link.icon size={24} />
                  </div>
                  <CardTitle>{link.title}</CardTitle>
                </div>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
