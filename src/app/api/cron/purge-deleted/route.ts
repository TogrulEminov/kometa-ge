import { runFullCleanup } from "@/actions/client/delete/cleanup.service";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { success: false, error: "CRON_SECRET konfiqurasiya edilməyib" },
      { status: 500 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await runFullCleanup();

    return NextResponse.json({
      success: result.success,
      totalDeletedRecords: result.totalDeletedRecords,
      totalDeletedFiles: result.totalDeletedFiles,
      unpublishedFilesDeleted: result.unpublishedFiles.deletedFiles,
      modules: result.modules.map((module) => ({
        key: module.key,
        label: module.label,
        deletedRecords: module.deletedRecords,
        deletedFiles: module.deletedFiles,
        errors: module.errors,
      })),
      errors: result.errors,
    });
  } catch (error) {
    console.error("cron/purge-deleted error:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Server error",
      },
      { status: 500 },
    );
  }
}
