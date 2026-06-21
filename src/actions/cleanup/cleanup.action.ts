"use server";

import { z } from "zod";
import { adminAction } from "@/lib/safe-action/SafeAction";
import { isCleanupModuleKey } from "@/lib/cleanup/cleanup.types";
import {
  cleanupUnpublishedFiles,
  deleteUnpublishedFilesByIds,
  getCleanupStats,
  purgeAllSoftDeleted,
  purgeSoftDeletedByModule,
  runFullCleanup,
} from "@/services/cleanup.service";

const moduleKeySchema = z.object({
  moduleKey: z.string().refine(isCleanupModuleKey, "Invalid cleanup module"),
});

const fileIdsSchema = z.object({
  fileIds: z.array(z.number().int().positive()).min(1),
});

export const fetchCleanupStatsAction = adminAction.action(async () => {
  return getCleanupStats();
});

export const purgeModuleDeletedAction = adminAction
  .inputSchema(moduleKeySchema)
  .action(async ({ parsedInput }) => {
    return purgeSoftDeletedByModule(parsedInput.moduleKey);
  });

export const purgeAllDeletedAction = adminAction.action(async () => {
  return purgeAllSoftDeleted();
});

export const cleanupUnpublishedFilesAction = adminAction.action(async () => {
  return cleanupUnpublishedFiles();
});

export const deleteUnpublishedFilesAction = adminAction
  .inputSchema(fileIdsSchema)
  .action(async ({ parsedInput }) => {
    return deleteUnpublishedFilesByIds(parsedInput.fileIds);
  });

export const runFullCleanupAction = adminAction.action(async () => {
  return runFullCleanup();
});
