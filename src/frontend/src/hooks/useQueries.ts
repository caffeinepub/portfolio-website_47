import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  IntroductionSection, 
  Achievement, 
  BlogPost, 
  ContactForm, 
  ContentSection, 
  CMSSettings, 
  PublicAISettings, 
  AISettings,
  SiteStats
} from '../backend';

// Introduction
export function useGetIntroduction() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['introduction'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getIntroduction();
    },
    enabled: !!actor && !isFetching
  });
}

export function useUpdateIntroduction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intro: IntroductionSection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateIntroduction(intro);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['introduction'] });
    }
  });
}

// Achievements
export function useGetAchievements() {
  const { actor, isFetching } = useActor();

  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAchievements();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAddAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievement: Achievement) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAchievement(achievement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['siteStats'] });
    }
  });
}

export function useUpdateAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievement: Achievement) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAchievement(achievement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
  });
}

export function useDeleteAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievementId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAchievement(achievementId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
  });
}

// Blog Posts
export function useGetBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPosts();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAddBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBlogPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['siteStats'] });
    }
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    }
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    }
  });
}

// Contact Forms
export function useGetContactForms() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactForm[]>({
    queryKey: ['contactForms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactForms();
    },
    enabled: !!actor && !isFetching
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: ContactForm) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactForms'] });
      queryClient.invalidateQueries({ queryKey: ['siteStats'] });
    }
  });
}

// Content Sections
export function useGetContentSections() {
  const { actor, isFetching } = useActor();

  return useQuery<ContentSection[]>({
    queryKey: ['contentSections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContentSections();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAddContentSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: ContentSection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContentSection(section);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
    }
  });
}

export function useUpdateContentSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: ContentSection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContentSection(section);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
    }
  });
}

export function useDeleteContentSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContentSection(sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
    }
  });
}

// CMS Settings
export function useGetCmsSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<CMSSettings>({
    queryKey: ['cmsSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCmsSettings();
    },
    enabled: !!actor && !isFetching
  });
}

export function useUpdateCmsSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: CMSSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCmsSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cmsSettings'] });
    }
  });
}

// AI Settings
export function useGetAiSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<PublicAISettings>({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAiSettings();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetFullAiSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<AISettings>({
    queryKey: ['fullAiSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFullAiSettings();
    },
    enabled: !!actor && !isFetching
  });
}

export function useUpdateAiSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: AISettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAiSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiSettings'] });
      queryClient.invalidateQueries({ queryKey: ['fullAiSettings'] });
    }
  });
}

// Site Stats
export function useGetSiteStats() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteStats>({
    queryKey: ['siteStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSiteStats();
    },
    enabled: !!actor && !isFetching
  });
}

// Check if user is admin
export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching
  });
}
