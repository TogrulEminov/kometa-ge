import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";

type DbClient = typeof db | Prisma.TransactionClient;

function getDb(client: DbClient = db): typeof db {
  return client as typeof db;
}

function toId(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const id = Number(value);
  return Number.isNaN(id) ? null : id;
}

/** Single upload: yeni faylı published=true, köhnəni published=false edir */
export async function publishSingleFile(
  {
    newFileId,
    previousFileId,
  }: {
    newFileId?: number | null;
    previousFileId?: number | null;
  },
  client: DbClient = db,
) {
  const prisma = getDb(client);
  const nextId = toId(newFileId);
  const prevId = toId(previousFileId);

  if (nextId && prevId && nextId === prevId) {
    await prisma.file.update({
      where: { id: nextId },
      data: { published: true },
    });
    return;
  }

  if (prevId && prevId !== nextId) {
    await prisma.file.updateMany({
      where: { id: prevId },
      data: { published: false },
    });
  }

  if (nextId) {
    await prisma.file.update({
      where: { id: nextId },
      data: { published: true },
    });
  }
}

/** Multi upload: yeni ID-ləri published=true, artıq istifadə olunmayanları false edir */
export async function publishGalleryFiles(
  {
    newFileIds = [],
    previousFileIds = [],
  }: {
    newFileIds?: number[];
    previousFileIds?: number[];
  },
  client: DbClient = db,
) {
  const prisma = getDb(client);
  const nextIds = new Set(newFileIds.map((id) => Number(id)).filter(Boolean));
  const prevIds = new Set(previousFileIds.map((id) => Number(id)).filter(Boolean));

  const toUnpublish = [...prevIds].filter((id) => !nextIds.has(id));
  const toPublish = [...nextIds];

  if (toUnpublish.length > 0) {
    await prisma.file.updateMany({
      where: { id: { in: toUnpublish } },
      data: { published: false },
    });
  }

  if (toPublish.length > 0) {
    await prisma.file.updateMany({
      where: { id: { in: toPublish } },
      data: { published: true },
    });
  }
}

/** Upload UI-dan silinəndə və ya fayl çıxarılanda */
export async function unpublishFile(
  fileId?: number | null,
  client: DbClient = db,
) {
  const prisma = getDb(client);
  const id = toId(fileId);
  if (!id) return;

  await prisma.file.updateMany({
    where: { id },
    data: { published: false },
  });
}
