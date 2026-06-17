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
  imageUrl?: DatabaseImageType | null;
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
