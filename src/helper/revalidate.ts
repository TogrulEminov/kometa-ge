"use server";
import { ALL_CACHE_TAG_GROUPS, CacheTag } from "@/actions/ui/cachetags";
import { updateTag } from "next/cache";
type RevalidateInput = CacheTag[] | CacheTag;
export async function revalidateAll(input?: RevalidateInput) {
  const targetTags = input
    ? Array.isArray(input)
      ? input
      : [input]
    : ALL_CACHE_TAG_GROUPS;

  try {
    targetTags.forEach((tag) => {
      updateTag(tag);
    });
    targetTags.forEach((tag) => {
      updateTag(tag);
    });
  } catch (err) {
    console.error("❌ Revalidate xətası:", err);
  }
}