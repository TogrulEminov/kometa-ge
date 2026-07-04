import {
  CustomUploadFile,
  DatabaseImageType,
  FileType,
} from "@/services/interface/type";

const CF_PUBLIC_URL =
  process.env.NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL?.replace(/\/$/, "") ?? "";

export function buildPublicAssetUrl(path?: string | null): string {
  if (!path) return "";

  if (path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!CF_PUBLIC_URL) return normalizedPath;

  return `${CF_PUBLIC_URL}${normalizedPath}`;
}

export const getFullImageUrl = (currentFile: CustomUploadFile) => {
  if (!currentFile.url) return "";
  return buildPublicAssetUrl(currentFile.url);
};

type ImageSource =
  | FileType
  | DatabaseImageType
  | { id?: number; publicUrl?: string | null; fileKey?: string | null; fullUrl?: string | null }
  | null
  | undefined;

export const getForCards = (currentFile: ImageSource): string => {
  if (!currentFile) return "";

  if ("fullUrl" in currentFile && currentFile.fullUrl) {
    return buildPublicAssetUrl(currentFile.fullUrl);
  }

  const urlToUse = currentFile.publicUrl || currentFile.fileKey;

  return buildPublicAssetUrl(urlToUse);
};
