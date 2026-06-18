export const FILE_SELECT = {
  where: {
    published: true,
  },
  select: {
    id: true,
    fileKey: true,
    fileSize: true,
    mimeType: true,
    publicUrl: true,
  },
} as const;
