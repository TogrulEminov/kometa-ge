import deleteImageService from "@/extensions/upload/delete-image";
import {
  CLEANUP_MODULE_DEFINITIONS,
  CLEANUP_MODULE_DELEGATES,
  getCleanupModuleDefinition,
} from "@/lib/cleanup/cleanupModules";
import type { CleanupModuleKey } from "@/lib/cleanup/cleanup.types";
import { db } from "@/lib/prisma";

export interface ModuleCleanupStats {
  key: CleanupModuleKey;
  label: string;
  route: string;
  deletedCount: number;
}

export interface CleanupStats {
  modules: ModuleCleanupStats[];
  unpublishedFileCount: number;
  totalDeletedItems: number;
}

export interface ModulePurgeResult {
  key: CleanupModuleKey;
  label: string;
  deletedRecords: number;
  deletedFiles: number;
  errors: string[];
}

export interface UnpublishedFileItem {
  id: number;
  fileKey: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  publicUrl: string;
  createdAt: Date;
}

export interface UnpublishedFilesCleanupResult {
  deletedFiles: number;
  errors: string[];
}

export interface FullCleanupResult {
  modules: ModulePurgeResult[];
  unpublishedFiles: UnpublishedFilesCleanupResult;
  totalDeletedRecords: number;
  totalDeletedFiles: number;
  success: boolean;
  errors: string[];
}

export type PurgeDeletedResult = {
  success: boolean;
  totalDeleted: number;
  errors: string[];
};

function collectFileIds(record: {
  imageId?: number | null;
  imageUrl?: { id: number } | null;
  gallery?: { id: number }[];
}): number[] {
  const ids = new Set<number>();

  if (typeof record.imageId === "number") {
    ids.add(record.imageId);
  }

  if (record.imageUrl?.id) {
    ids.add(record.imageUrl.id);
  }

  for (const file of record.gallery ?? []) {
    if (file?.id) {
      ids.add(file.id);
    }
  }

  return [...ids];
}

async function deleteFilesByIds(fileIds: number[]): Promise<{
  deletedCount: number;
  errors: string[];
}> {
  if (fileIds.length === 0) {
    return { deletedCount: 0, errors: [] };
  }

  const result = await deleteImageService.deleteFilesByIds({ fileIds });
  const deletedCount =
    result.deletedFiles?.filter((item) => item.success).length ?? 0;
  const errors =
    result.deletedFiles
      ?.filter((item) => !item.success)
      .map((item) => `File#${item.id}: ${item.error ?? "Delete failed"}`) ?? [];

  if (!result.success && result.error) {
    errors.push(result.error);
  }

  return { deletedCount, errors };
}

export async function getCleanupStats(): Promise<CleanupStats> {
  const modules = await Promise.all(
    CLEANUP_MODULE_DEFINITIONS.map(async (definition) => {
      const deletedCount =
        await CLEANUP_MODULE_DELEGATES[definition.key].countDeleted();

      return {
        key: definition.key,
        label: definition.label,
        route: definition.route,
        deletedCount,
      };
    }),
  );

  const unpublishedFileCount = await db.file.count({
    where: { published: false },
  });

  const totalDeletedItems = modules.reduce(
    (sum, module) => sum + module.deletedCount,
    0,
  );

  return {
    modules,
    unpublishedFileCount,
    totalDeletedItems,
  };
}

export async function getUnpublishedFiles(): Promise<UnpublishedFileItem[]> {
  return db.file.findMany({
    where: { published: false },
    select: {
      id: true,
      fileKey: true,
      originalName: true,
      mimeType: true,
      fileSize: true,
      publicUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteUnpublishedFilesByIds(
  fileIds: number[],
): Promise<UnpublishedFilesCleanupResult> {
  if (fileIds.length === 0) {
    return { deletedFiles: 0, errors: [] };
  }

  const result = await deleteFilesByIds(fileIds);

  return {
    deletedFiles: result.deletedCount,
    errors: result.errors,
  };
}

export async function purgeSoftDeletedByModule(
  moduleKey: CleanupModuleKey,
): Promise<ModulePurgeResult> {
  const definition = getCleanupModuleDefinition(moduleKey);
  const delegate = CLEANUP_MODULE_DELEGATES[moduleKey];
  const items = await delegate.findDeleted();

  let deletedRecords = 0;
  let deletedFiles = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      const fileIds = collectFileIds(item);

      if (fileIds.length > 0) {
        const fileResult = await deleteFilesByIds(fileIds);
        deletedFiles += fileResult.deletedCount;
        errors.push(...fileResult.errors);
      }

      await delegate.hardDelete(item.id);
      deletedRecords++;
    } catch (error) {
      errors.push(
        `${definition.label}#${item.id}: ${(error as Error).message}`,
      );
    }
  }

  return {
    key: moduleKey,
    label: definition.label,
    deletedRecords,
    deletedFiles,
    errors,
  };
}

export async function purgeAllSoftDeleted(): Promise<{
  modules: ModulePurgeResult[];
  totalDeletedRecords: number;
  totalDeletedFiles: number;
  success: boolean;
  errors: string[];
}> {
  const modules: ModulePurgeResult[] = [];

  for (const definition of CLEANUP_MODULE_DEFINITIONS) {
    modules.push(await purgeSoftDeletedByModule(definition.key));
  }

  const totalDeletedRecords = modules.reduce(
    (sum, module) => sum + module.deletedRecords,
    0,
  );
  const totalDeletedFiles = modules.reduce(
    (sum, module) => sum + module.deletedFiles,
    0,
  );
  const errors = modules.flatMap((module) => module.errors);

  return {
    modules,
    totalDeletedRecords,
    totalDeletedFiles,
    success: errors.length === 0,
    errors,
  };
}

export async function cleanupUnpublishedFiles(): Promise<UnpublishedFilesCleanupResult> {
  const files = await db.file.findMany({
    where: { published: false },
    select: { id: true },
  });

  return deleteUnpublishedFilesByIds(files.map((file) => file.id));
}

export async function runFullCleanup(): Promise<FullCleanupResult> {
  const softDeleteResult = await purgeAllSoftDeleted();
  const unpublishedFiles = await cleanupUnpublishedFiles();

  const errors = [...softDeleteResult.errors, ...unpublishedFiles.errors];

  return {
    modules: softDeleteResult.modules,
    unpublishedFiles,
    totalDeletedRecords: softDeleteResult.totalDeletedRecords,
    totalDeletedFiles:
      softDeleteResult.totalDeletedFiles + unpublishedFiles.deletedFiles,
    success: errors.length === 0,
    errors,
  };
}

/** @deprecated Use getCleanupStats instead */
export async function countDeletedItems(): Promise<number> {
  const stats = await getCleanupStats();
  return stats.totalDeletedItems;
}

/** Backward-compatible wrapper used by cron route */
export async function purgeDeletedItems(): Promise<PurgeDeletedResult> {
  const result = await runFullCleanup();

  return {
    success: result.success,
    totalDeleted:
      result.totalDeletedRecords + result.unpublishedFiles.deletedFiles,
    errors: result.errors,
  };
}
