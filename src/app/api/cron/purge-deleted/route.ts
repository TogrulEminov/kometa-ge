import { purgeDeletedItems } from "@/lib/purgeDeletedItems";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { success: false, error: "CRON_SECRET konfiqurasiya edilməyib" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await purgeDeletedItems();

    return NextResponse.json({
      success: result.success,
      totalDeleted: result.totalDeleted,
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
