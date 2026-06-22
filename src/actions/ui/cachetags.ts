export const CACHE_TAG_GROUPS = {
    ABOUT_MAIN: "about_main_cache",
    HERO: "hero_section_cache", 
    SERVICES: "services_cache",
    DIRECTIONS: "directions_cache",
    CERTIFICATES: "certificates_cache",
    PHOTO_GALLERY: "photo_gallery_cache",
    VIDEO_GALLERY: "video_gallery_cache",
    ABOUT_HOME: "about_home_cache",
    FEATURES: "features_cache",
    WORK_PROCESS: "work_process_cache",
    FAQ: "faq_cache",
    CONTACT_INFORMATION: "contact_information_cache",
    SUB_SERVICES: "sub_services_cache",
    SOCIAL_MEDIA: "social_media_cache",
    SECTION_CONTENT: "section_content_cache",
    CATEGORIES: "categories_cache",
    ENUM: "enum_cache",
  } as const;
  
  export type CacheTag = (typeof CACHE_TAG_GROUPS)[keyof typeof CACHE_TAG_GROUPS];
  
  export const ALL_CACHE_TAG_GROUPS: CacheTag[] = Object.values(CACHE_TAG_GROUPS);