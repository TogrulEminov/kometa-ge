import { NextRequest } from "next/server";
import { db } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const fileId = Number((await params).id);

    if (!fileId || Number.isNaN(fileId)) {
      return Response.json({ error: "File ID is required" }, { status: 400 });
    }

    const file = await db.file.findUnique({ where: { id: fileId } });

    if (!file) {
      return Response.json({ error: "File not found" }, { status: 404 });
    }

    await db.file.update({
      where: { id: fileId },
      data: { published: false },
    });

    return Response.json({
      success: true,
      message: "File unpublished successfully",
    });
  } catch (error) {
    console.error("Unpublish API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      { error: "Unpublish failed", details: errorMessage },
      { status: 500 },
    );
  }
}
