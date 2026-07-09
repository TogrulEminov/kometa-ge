import { buildLlmsContent } from "@/lib/llms/build-llms-content";
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(buildLlmsContent(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
