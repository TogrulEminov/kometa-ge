import { v4 as uuidv4 } from "uuid";
import * as r2UploadService from "./r2-upload";
import { applyImageWatermark } from "./apply-image-watermark";
import sharp from "sharp";
import path from "path";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = Number(process.env.MAX_VIDEO_UPLOAD_MB) || 100;

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/ogg",
];

const MODEL_MIME_TYPES = [
  "model/gltf-binary",
  "application/octet-stream",
  "model/gltf+json",
  "application/obj",
  "application/fbx",
  "application/stl",
];

const ALLOWED_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
  ...MODEL_MIME_TYPES,
];

function resolveMimeType(file: File): string {
  if (file.type) return file.type;

  const ext = path.extname(file.name).toLowerCase();
  const extMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".ogv": "video/ogg",
  };

  return extMap[ext] ?? "";
}

function getMaxSizeBytes(mimeType: string): number {
  if (mimeType.startsWith("video/")) {
    return MAX_VIDEO_SIZE_MB * 1024 * 1024;
  }

  return MAX_IMAGE_SIZE_MB * 1024 * 1024;
}

export async function uploadImage(file: File, apiEndpoint?: string) {
  try {
    const mimeType = resolveMimeType(file);

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(
        `Unsupported file type: ${mimeType || file.type || "unknown"}`,
      );
    }

    const maxSizeBytes = getMaxSizeBytes(mimeType);
    const maxSizeMb = mimeType.startsWith("video/")
      ? MAX_VIDEO_SIZE_MB
      : MAX_IMAGE_SIZE_MB;

    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds the limit of ${maxSizeMb}MB.`);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let processedBuffer: Buffer = fileBuffer;
    let finalMimeType: string = mimeType;
    let finalFileName: string = file.name;

    if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") {
      const image = sharp(fileBuffer);

      try {
        processedBuffer = await image.webp({ lossless: true }).toBuffer();
        processedBuffer = await applyImageWatermark(processedBuffer);

        finalMimeType = "image/webp";
        finalFileName = `${path.parse(file.name).name}.webp`;
      } catch (sharpError) {
        console.warn(
          `Sharp processing failed for ${file.name}. Using original file type.`,
          sharpError,
        );
      }
    }
    const uniqueFileName = `${uuidv4()}-${finalFileName}`;

    const r2Result = await r2UploadService.uploadBufferToR2(
      process.env.CF_BUCKET,
      uniqueFileName,
      finalMimeType,
      processedBuffer,
      apiEndpoint
    );

    if (!r2Result) {
      throw new Error("File upload error: No result from R2 service.");
    }

    return r2Result;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Image upload process failed:", errorMessage);
    throw error;
  }
}
