"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { Role } from "@/services/interface/type";
import { getCleanupStats, getUnpublishedFiles } from "@/services/cleanup.service";

async function assertAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Bu əməliyyat üçün icazəniz yoxdur!");
  }
}

export async function getCleanupStatsQuery() {
  await assertAdmin();
  return getCleanupStats();
}

export async function getUnpublishedFilesQuery() {
  await assertAdmin();
  return getUnpublishedFiles();
}
