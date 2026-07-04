import type { Accept } from "react-dropzone";

export const IMAGE_ACCEPT: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/svg+xml": [".svg"],
  "application/pdf": [".pdf"],
};

export const VIDEO_ACCEPT: Accept = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
  "video/x-msvideo": [".avi"],
  "video/ogg": [".ogv"],
};

export function parseAccept(acceptType: string): Accept | undefined {
  if (!acceptType || acceptType === "*/*") return undefined;
  if (acceptType === "image/*") return IMAGE_ACCEPT;
  if (acceptType === "video/*") return VIDEO_ACCEPT;
  return { [acceptType]: [] };
}
