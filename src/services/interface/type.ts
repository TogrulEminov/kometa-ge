export const Role = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
} as const;

export const Status = {
  published: "published",
  draft: "draft",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const CustomLocales = {
  en: "en",
  ka: "ka",
} as const;

export type CustomLocales = (typeof CustomLocales)[keyof typeof CustomLocales];
export const StaticKey = {
  main: "main",
} as const;

export type StaticKey = (typeof StaticKey)[keyof typeof StaticKey];

export const SectionKey = {
  services: "services",
  media: "media",
  contact: "contact",
} as const;
export type SectionKey = (typeof SectionKey)[keyof typeof SectionKey];

export const SocialMediaKey = {
  facebook: "facebook",
  instagram: "instagram",
  twitter: "twitter",
  linkedin: "linkedin",
  youtube: "youtube",
  telegram: "telegram",
  whatsapp: "whatsapp",
  tiktok: "tiktok",
} as const;

export type SocialMediaKey =
  (typeof SocialMediaKey)[keyof typeof SocialMediaKey];
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: "moderator" | "admin" | "user" | string;
  createdAt: Date;
  updatedAt: Date;
}
export interface jsonItem {
  itemTitle?: string | null;
  itemDescription?: string | null;
  itemValue?: string | null;
  itemSuffix?: string | null;
  itemKey?: "mission" | "vision";
}

export interface newInfoJson {
  title: string;
  type?: string | undefined;
  description?: string | null;
  items: jsonItem[];
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
  impersonatedBy?: string | null;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface FileType {
  fullUrl?: string;
  type?: any;
  data?: any;
  fileId?: any | number | undefined;
  relativePath?: any | string | undefined;
  id?: number;
  fileKey?: string | null;
  originalName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  publicUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export type DatabaseImageType = Pick<FileType, "id" | "fileKey" | "publicUrl">;
export type UploadedFileMeta = {
  fileid: number;
  fileKey: string;
  publicUrl: string;
  [key: string]: any;
} | null;

export const EnumKey = {
  contact: "contact",
} as const;

export type EnumKey = (typeof EnumKey)[keyof typeof EnumKey];
export interface CustomUploadFile {
  type: any;
  uid: string;
  name: string;
  status: "done" | "uploading" | "error" | "removed";
  url?: string;
  originFileObj?: File;
  fileId?: number;
  fileKey?: string;
}
export type Category = {
  id: string;
  slug: string;
  isDeleted: boolean;
  imageId: number | null;
  imageUrl?: FileType | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  user?: User | null;
  translations?: CategoryTranslation[];
};
export type CategoryTranslation = {
  id: string;
  title: string;
  description: string | null;
  locale: CustomLocales;
  documentId: string | null;
  document?: Category | null;
  seoId: string | null;
  seo?: Seo | null;

  createdAt: Date;
  updatedAt: Date;
};
interface Seo {
  id: string;
  metaDescription: string;
  metaKeywords: string;
  metaTitle: string;
  locale: CustomLocales;
  image: string;
}

// 2. Tərcümə Modeli üçün İnterfeys (ContactInformationTranslation)
interface IContactInformationTranslation {
  id: string;
  adress: string;
  documentId: string;
  locale: CustomLocales;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// 3. Əsas Əlaqə Modeli üçün İnterfeys (ContactInformation)
export interface IContactInformation {
  id: string;
  documentId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  phone: string;
  phoneSecond?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  adressLink?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  translations?: IContactInformationTranslation[];
  isDeleted: boolean;
}

export interface HeroInfoTranslation {
  id: string;
  title: string;
  slug: string | null;
  subTitle?: string | null;
  description?: string | null;
  locale: CustomLocales;
  documentId: string | null;
  document?: HeroInfo | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// 2. HeroInfo Əsas İnterfeysi
export interface HeroInfo {
  id: string;
  imageId: number | null;
  imageUrl: FileType | null;
  key: StaticKey;
  userId: string | null;
  user?: User | null;
  translations: HeroInfoTranslation[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
// youtube
interface YoutubeTranslations {
  id: string;
  title: string;
  description: string;
  slug: string;
  locale: string;
  documentId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
export type YoutubeItems = {
  id: string;
  url: string;
  imageUrl?: FileType | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  translations: YoutubeTranslations[];
  orderNumber?: number;
};
interface SectionContentTr {
  title: string;
  description: string;
  subTitle?: string;
  highlightWord?: string;
  id: string;
  documentId: string;
  slug: string;
  locale: string;
}

export type SectionContent = {
  id: string;
  key: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  translations: SectionContentTr[];
};
type EnumTranslation = {
  id: string;
  title: string;
  slug: string;
  locale: CustomLocales;
  description?: string;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Enum = {
  id: string;
  documentId: string;
  count?: number;
  isActive?: boolean;
  createdAt: Date;
  key?: EnumKey | undefined;
  updatedAt: Date;
  status: Status;
  translations: EnumTranslation[];
};
export interface Social {
  id: string;
  socialName: string;
  socialLink: string;
  iconName: string;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}
export type FaqItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  orderNumber: number | null;
  isDeleted: boolean;
  translations: FaqItemTranslationType[];
};

export type FaqItemTranslationType = {
  id: string;
  title: string;
  slug: string | null;
  locale: CustomLocales;
  documentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
};
export interface WorkJson {
  title?: string | null;
  description?: string | null;
}
export type WorkProcessItemTranslationType = {
  id: string;
  title: string;
  subTitle?: string | null;
  description?: WorkJson[] | null;
  locale: CustomLocales;
  documentId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type WorkProcessItem = {
  id: string;
  userId: string | null;
  key: StaticKey;
  imageId: number | null;
  imageUrl: FileType;
  createdAt: Date | string;
  updatedAt: Date | string;
  translations: WorkProcessItemTranslationType[];
};
export type AboutHomeTranslationType = {
  id: string;
  title: string;
  subTitle: string | null;
  features: newInfoJson[] | null;
  locale: CustomLocales;
  description?: string | null;
  documentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AboutHomeType = {
  id: string;
  imageUrl?: FileType | null;
  imageId: number | null;
  userId: string | null;
  key: StaticKey;
  createdAt: Date;
  updatedAt: Date;

  translations: AboutHomeTranslationType[];
};
