import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EditIntroduction from './pages/admin/EditIntroduction';
import ManageAchievements from './pages/admin/ManageAchievements';
import ManageBlogPosts from './pages/admin/ManageBlogPosts';
import EditAISettings from './pages/admin/EditAISettings';
import ManageCustomSections from './pages/admin/ManageCustomSections';
import ContactSubmissions from './pages/admin/ContactSubmissions';
import CMSSettings from './pages/admin/CMSSettings';
import ChatWidget from './components/ChatWidget';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$postId',
  component: BlogPostPage
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard
});

const editIntroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/introduction',
  component: EditIntroduction
});

const manageAchievementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/achievements',
  component: ManageAchievements
});

const manageBlogPostsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/blog',
  component: ManageBlogPosts
});

const editAISettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/ai-settings',
  component: EditAISettings
});

const manageCustomSectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/custom-sections',
  component: ManageCustomSections
});

const contactSubmissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/contacts',
  component: ContactSubmissions
});

const cmsSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/cms-settings',
  component: CMSSettings
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute,
  blogPostRoute,
  contactRoute,
  adminRoute,
  editIntroRoute,
  manageAchievementsRoute,
  manageBlogPostsRoute,
  editAISettingsRoute,
  manageCustomSectionsRoute,
  contactSubmissionsRoute,
  cmsSettingsRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <ChatWidget />
      <Toaster />
    </ThemeProvider>
  );
}
