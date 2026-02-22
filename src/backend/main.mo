import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Initialize Access Control for authorization and persistent state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Achievement {
    public type Achievement = {
      id : Text;
      title : Text;
      description : Text;
      image : ?Storage.ExternalBlob;
      date : Time.Time;
    };

    public func compareByDate(a1 : Achievement, a2 : Achievement) : Order.Order {
      Text.compare(a1.title, a2.title);
    };
  };

  module BlogPost {
    public type BlogPost = {
      id : Text;
      title : Text;
      content : Text;
      publicationDate : Time.Time;
      featuredImage : ?Storage.ExternalBlob;
    };

    public func compareByTitle(b1 : BlogPost, b2 : BlogPost) : Order.Order {
      Text.compare(b1.title, b2.title);
    };
  };

  // Types
  type IntroductionSection = {
    id : Text;
    name : Text;
    title : Text;
    bio : Text;
    profileImage : ?Storage.ExternalBlob;
  };

  public type ContactForm = {
    id : Text;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
    salesforceId : ?Text;
  };

  public type DigitalMarketingData = {
    metricName : Text;
    metricValue : Nat;
    timestamp : Time.Time;
  };

  public type ContentSection = {
    id : Text;
    title : Text;
    content : Text;
    image : ?Storage.ExternalBlob;
  };

  public type CMSSettings = {
    theme : Text;
    layoutOptions : Text;
    customSectionOrder : [Text];
  };

  public type UISettings = {
    theme : Text;
    layoutPreferences : Text;
  };

  public type SiteStats = {
    totalVisits : Nat;
    totalMessages : Nat;
    totalAchievements : Nat;
    totalBlogPosts : Nat;
  };

  public type AISettings = {
    botName : Text;
    initialGreeting : Text;
    avatarImage : ?Storage.ExternalBlob;
    salesforceApiKey : Text;
  };

  // Public AI Settings without sensitive data
  public type PublicAISettings = {
    botName : Text;
    initialGreeting : Text;
    avatarImage : ?Storage.ExternalBlob;
  };

  // Internal State - Needs to be persistent
  // Store maps for achievements, blog posts, and content sections, contact forms
  let achievements = List.empty<Achievement.Achievement>();
  let blogPosts = List.empty<BlogPost.BlogPost>();
  let contentSections = List.empty<ContentSection>();

  let forms = List.empty<ContactForm>();

  // Settings and stats
  var introduction : IntroductionSection = {
    id = "intro";
    name = "Salesforce Senior Engineer";
    title = "Professional Bio";
    bio = "Experienced Salesforce Engineer...";
    profileImage = null;
  };

  var cmsSettings : CMSSettings = {
    theme = "default";
    layoutOptions = "standard";
    customSectionOrder = [];
  };

  var uiSettings : UISettings = {
    theme = "light";
    layoutPreferences = "default";
  };

  var aiSettings : AISettings = {
    botName = "SalesforceBot";
    initialGreeting = "Hi, How can I help you? 👋";
    avatarImage = null;
    salesforceApiKey = "";
  };

  var stat : SiteStats = {
    totalVisits = 0;
    totalMessages = 0;
    totalAchievements = 0;
    totalBlogPosts = 0;
  };

  var digitalMarketingData = Map.empty<Text, DigitalMarketingData>();

  // Introduction Section
  public query ({ caller }) func getIntroduction() : async IntroductionSection {
    introduction;
  };

  public shared ({ caller }) func updateIntroduction(newIntro : IntroductionSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the introduction section");
    };
    introduction := newIntro;
  };

  // Achievements
  public query ({ caller }) func getAchievements() : async [Achievement.Achievement] {
    achievements.toArray().sort(Achievement.compareByDate);
  };

  public shared ({ caller }) func addAchievement(newAchievement : Achievement.Achievement) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add achievements");
    };
    achievements.add(newAchievement);
    stat := {
      totalVisits = stat.totalVisits;
      totalMessages = stat.totalMessages;
      totalAchievements = stat.totalAchievements + 1;
      totalBlogPosts = stat.totalBlogPosts;
    };
  };

  public shared ({ caller }) func updateAchievement(updatedAchievement : Achievement.Achievement) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update achievements");
    };
    let index = achievements.findIndex(func(ach) { ach.id == updatedAchievement.id });
    switch (index) {
      case (?i) {
        let mutableAchievements = achievements.toVarArray();
        mutableAchievements[i] := updatedAchievement;
        achievements.clear();
        achievements.addAll(mutableAchievements.values());
      };
      case (null) { Runtime.trap("Achievement not found") };
    };
  };

  public shared ({ caller }) func deleteAchievement(achievementId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete achievements");
    };
    let filteredAchievements = achievements.filter(func(ach) { ach.id != achievementId });
    achievements.clear();
    achievements.addAll(filteredAchievements.values());
  };

  // Blog Posts
  public query ({ caller }) func getBlogPosts() : async [BlogPost.BlogPost] {
    blogPosts.toArray().sort(BlogPost.compareByTitle);
  };

  public shared ({ caller }) func addBlogPost(newPost : BlogPost.BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add blog posts");
    };
    blogPosts.add(newPost);
    stat := {
      totalVisits = stat.totalVisits;
      totalMessages = stat.totalMessages;
      totalAchievements = stat.totalAchievements;
      totalBlogPosts = stat.totalBlogPosts + 1;
    };
  };

  public shared ({ caller }) func updateBlogPost(updatedPost : BlogPost.BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    let index = blogPosts.findIndex(func(post) { post.id == updatedPost.id });
    switch (index) {
      case (?i) {
        let mutablePosts = blogPosts.toVarArray();
        mutablePosts[i] := updatedPost;
        blogPosts.clear();
        blogPosts.addAll(mutablePosts.values());
      };
      case (null) {
        Runtime.trap("Blog post not found");
      };
    };
  };

  public shared ({ caller }) func deleteBlogPost(postId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    let filteredPosts = blogPosts.filter(func(post) { post.id != postId });
    blogPosts.clear();
    blogPosts.addAll(filteredPosts.values());
  };

  // Contact Forms
  public query ({ caller }) func getContactForms() : async [ContactForm] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact forms");
    };
    forms.toArray();
  };

  public shared ({ caller }) func submitContactForm(form : ContactForm) : async () {
    // No authorization check - anyone can submit a contact form
    forms.add(form);
    stat := {
      totalVisits = stat.totalVisits;
      totalMessages = stat.totalMessages + 1;
      totalAchievements = stat.totalAchievements;
      totalBlogPosts = stat.totalBlogPosts;
    };
  };

  // Content Sections
  public query ({ caller }) func getContentSections() : async [ContentSection] {
    contentSections.toArray();
  };

  public shared ({ caller }) func addContentSection(newSection : ContentSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add content sections");
    };
    contentSections.add(newSection);
  };

  public shared ({ caller }) func updateContentSection(updatedSection : ContentSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content sections");
    };
    let index = contentSections.findIndex(func(section) { section.id == updatedSection.id });
    switch (index) {
      case (?i) {
        let mutableContent = contentSections.toVarArray();
        mutableContent[i] := updatedSection;
        contentSections.clear();
        contentSections.addAll(mutableContent.values());
      };
      case (null) {
        Runtime.trap("Content section not found");
      };
    };
  };

  public shared ({ caller }) func deleteContentSection(sectionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete content sections");
    };
    let filteredContent = contentSections.filter(func(section) { section.id != sectionId });
    contentSections.clear();
    contentSections.addAll(filteredContent.values());
  };

  // CMS Settings
  public query ({ caller }) func getCmsSettings() : async CMSSettings {
    cmsSettings;
  };

  public shared ({ caller }) func updateCmsSettings(newSettings : CMSSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update CMS settings");
    };
    cmsSettings := newSettings;
  };

  // UI Settings
  public query ({ caller }) func getUiSettings() : async UISettings {
    uiSettings;
  };

  public shared ({ caller }) func updateUiSettings(newSettings : UISettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update UI settings");
    };
    uiSettings := newSettings;
  };

  // Site Stats
  public query ({ caller }) func getSiteStats() : async SiteStats {
    stat;
  };

  public shared ({ caller }) func updateSiteStats(newStats : SiteStats) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site stats");
    };
    stat := newStats;
  };

  // AI Settings - Public version without sensitive data
  public query ({ caller }) func getAiSettings() : async PublicAISettings {
    {
      botName = aiSettings.botName;
      initialGreeting = aiSettings.initialGreeting;
      avatarImage = aiSettings.avatarImage;
    };
  };

  // AI Settings - Full version for admins only
  public query ({ caller }) func getFullAiSettings() : async AISettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view full AI settings");
    };
    aiSettings;
  };

  public shared ({ caller }) func updateAiSettings(newSettings : AISettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update AI settings");
    };
    aiSettings := newSettings;
  };

  // Digital Marketing Data
  public query ({ caller }) func getDigitalMarketingData(metricName : Text) : async ?DigitalMarketingData {
    digitalMarketingData.get(metricName);
  };

  public shared ({ caller }) func addDigitalMarketingData(newData : DigitalMarketingData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add digital marketing data");
    };
    digitalMarketingData.add(newData.metricName, newData);
  };

  public shared ({ caller }) func updateDigitalMarketingData(updatedData : DigitalMarketingData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update digital marketing data");
    };
    if (not digitalMarketingData.containsKey(updatedData.metricName)) {
      Runtime.trap("Metric does not exist");
    };
    digitalMarketingData.add(updatedData.metricName, updatedData);
  };

  public query ({ caller }) func getAllDigitalMarketingData() : async [DigitalMarketingData] {
    digitalMarketingData.values().toArray();
  };
};
