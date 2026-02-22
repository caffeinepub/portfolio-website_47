import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SiteStats {
    totalBlogPosts: bigint;
    totalMessages: bigint;
    totalVisits: bigint;
    totalAchievements: bigint;
}
export interface PublicAISettings {
    initialGreeting: string;
    botName: string;
    avatarImage?: ExternalBlob;
}
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    featuredImage?: ExternalBlob;
    publicationDate: Time;
}
export type Time = bigint;
export interface ContactForm {
    id: string;
    salesforceId?: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface DigitalMarketingData {
    metricValue: bigint;
    timestamp: Time;
    metricName: string;
}
export interface IntroductionSection {
    id: string;
    bio: string;
    title: string;
    profileImage?: ExternalBlob;
    name: string;
}
export interface Achievement {
    id: string;
    title: string;
    date: Time;
    description: string;
    image?: ExternalBlob;
}
export interface UISettings {
    theme: string;
    layoutPreferences: string;
}
export interface AISettings {
    salesforceApiKey: string;
    initialGreeting: string;
    botName: string;
    avatarImage?: ExternalBlob;
}
export interface CMSSettings {
    theme: string;
    customSectionOrder: Array<string>;
    layoutOptions: string;
}
export interface ContentSection {
    id: string;
    title: string;
    content: string;
    image?: ExternalBlob;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAchievement(newAchievement: Achievement): Promise<void>;
    addBlogPost(newPost: BlogPost): Promise<void>;
    addContentSection(newSection: ContentSection): Promise<void>;
    addDigitalMarketingData(newData: DigitalMarketingData): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAchievement(achievementId: string): Promise<void>;
    deleteBlogPost(postId: string): Promise<void>;
    deleteContentSection(sectionId: string): Promise<void>;
    getAchievements(): Promise<Array<Achievement>>;
    getAiSettings(): Promise<PublicAISettings>;
    getAllDigitalMarketingData(): Promise<Array<DigitalMarketingData>>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getCallerUserRole(): Promise<UserRole>;
    getCmsSettings(): Promise<CMSSettings>;
    getContactForms(): Promise<Array<ContactForm>>;
    getContentSections(): Promise<Array<ContentSection>>;
    getDigitalMarketingData(metricName: string): Promise<DigitalMarketingData | null>;
    getFullAiSettings(): Promise<AISettings>;
    getIntroduction(): Promise<IntroductionSection>;
    getSiteStats(): Promise<SiteStats>;
    getUiSettings(): Promise<UISettings>;
    isCallerAdmin(): Promise<boolean>;
    submitContactForm(form: ContactForm): Promise<void>;
    updateAchievement(updatedAchievement: Achievement): Promise<void>;
    updateAiSettings(newSettings: AISettings): Promise<void>;
    updateBlogPost(updatedPost: BlogPost): Promise<void>;
    updateCmsSettings(newSettings: CMSSettings): Promise<void>;
    updateContentSection(updatedSection: ContentSection): Promise<void>;
    updateDigitalMarketingData(updatedData: DigitalMarketingData): Promise<void>;
    updateIntroduction(newIntro: IntroductionSection): Promise<void>;
    updateSiteStats(newStats: SiteStats): Promise<void>;
    updateUiSettings(newSettings: UISettings): Promise<void>;
}
