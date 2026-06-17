"use server";
import { ZodError } from "zod";
import { db } from "../../../lib/admin/prismaClient";
import { Prisma } from "@/src/generated/prisma/client";
import { Locales } from "@/src/generated/prisma/enums";
import { formatZodErrors } from "../../../utils/format-zod-errors";
import {
  createYoutubeSchema,
  uptadeYoutubeSchema,
} from "@/src/actions/client/youtube/youtube.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
import {
  formatYoutubeDuration,
  getYouTubeVideoId,
} from "@/src/utils/getYouutbeVideoId";
import { FILE_SELECT } from "@/src/helper/fragments";
import { authActionClient } from "@/src/lib/safe-action";
import { imageSchema } from "@/src/services/global/global.type";

type GetProps = {
  page?: number;
  query?: string;
  pageSize?: number;
  locale: Locales;
  sort?: string;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};

export async function getYoutube({
  page,
  pageSize,
  query,
  locale,
  sort = "desc",
}: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  try {
    const whereClause: Prisma.YoutubeWhereInput = {
      isDeleted: false,
      translations: {
        some: {
          locale: locale,
          ...(searchTerm && {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          }),
        },
      },
    };
    const [data, totalCount] = await Promise.all([
      db.youtube.findMany({
        where: whereClause,
        select: {
          status: true,
          id: true,
          imageUrl: true,
          duration: true,
          url: true,
          createdAt: true,
          updatedAt: true,
          translations: {
            where: {
              locale: locale,
            },
            select: {
              slug: true,
              id: true,
              locale: true,
              title: true,
              documentId: true,
            },
          },
        },
        orderBy: { createdAt: (sort as Prisma.SortOrder) ?? "desc" },
        skip: skip,
        take: take,
      }),
      db.youtube.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / customPageSize);
    return {
      success: true,
      code: "SUCCESS",
      message: "Success",
      data: totalCount < 1 ? [] : data,
      paginations: {
        page: customPage,
        pageSize: customPageSize,
        totalPages: totalPages,
        dataCount: totalCount,
      },
    };
  } catch (error) {
    console.error("getYoutube error:", error);
    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Internal Server Error - ${errorMessage}`,
    };
  }
}

export async function getYoutubeById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.YoutubeWhereInput = {
      isDeleted: false,
      id: id,
      translations: {
        some: { locale },
      },
    };
    const existingData = await db.youtube.findFirst({
      where: whereClause,
      include: {
        imageUrl: FILE_SELECT,
        translations: {
          where: { locale },
        },
      },
    });

    return { data: existingData };
  } catch (error) {
    console.error("getYoutubeById error:", error);
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}

export const createYoutube = authActionClient
  .inputSchema(createYoutubeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, imageId, url } = parsedInput;
      const custom_slug = createSlug(title);
      const existingData = await db.youtube.findFirst({
        where: {
          isDeleted: false,
          translations: {
            some: { locale: locale, slug: custom_slug },
          },
        },
      });
      if (existingData) {
        throw new Error("Data with this title and slug already exists");
      }
      let videoId: string | null = null;
      let duration: string | null = null;

      if (url) {
        videoId = getYouTubeVideoId(url);
      }

      if (videoId) {
        const apiKey = process.env.CLOUD_GOOGLE_API_KEY;
        if (!apiKey) {
          console.error("CLOUD_GOOGLE_API_KEY is not set.");
          // API key olmasa bele davam et, duration boş qalsın
        } else {
          const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const data = await response.json();
            const videoData = data.items?.[0];

            // Duration əldə et
            if (videoData?.contentDetails?.duration) {
              const rawDuration = videoData.contentDetails.duration;
              duration = formatYoutubeDuration(rawDuration);
            } else {
              console.warn("Duration tapılmadı!");
            }
          } else {
            console.error(
              `YouTube API error: ${response.status} ${response.statusText}`,
            );
          }
        }
      }

      const newData = await db.youtube.create({
        data: {
          imageId: Number(imageId) || null,
          duration: duration ?? "",
          url: url,
          translations: {
            create: {
              slug: custom_slug,
              title: title,
              locale: locale,
            },
          },
        },
      });
      return newData;
    } catch (error) {
      console.error("createYoutube error:", error);
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(formatZodErrors(error)));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });

export const updateYoutube = authActionClient
  .inputSchema(uptadeYoutubeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, url, id } = parsedInput;
      const existingData = await db.youtube.findUnique({
        where: {
          id: id,
          isDeleted: false,
        },
        include: {
          translations: true,
        },
      });
      if (!existingData) {
        throw new Error("Video tapılmadı");
      }

      const customSlug = createSlug(title);

      let videoId: string | null = null;
      let duration: string | undefined = existingData.duration || undefined; // Mövcud duration-ı qoru

      if (url) {
        videoId = getYouTubeVideoId(url);
      }
      if (url && (url !== existingData.url || !duration)) {
        if (videoId) {
          const apiKey = process.env.CLOUD_GOOGLE_API_KEY;
          if (!apiKey) {
            console.error("CLOUD_GOOGLE_API_KEY is not set.");
          } else {
            const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
            const response = await fetch(apiUrl);

            if (response.ok) {
              const data = await response.json();
              const videoData = data.items?.[0];

              if (videoData?.contentDetails?.duration) {
                const rawDuration = videoData.contentDetails.duration;
                duration = formatYoutubeDuration(rawDuration);
              } else {
                duration = ""; // Duration tapılmadısa boş qalsın
                console.warn("Duration tapılmadı!");
              }
            } else {
              console.error(
                `YouTube API error during update: ${response.status} ${response.statusText}`,
              );
            }
          }
        }
      }

      const updateData = await db.$transaction(async (prisma) => {
        const updatedData = await prisma.youtube.update({
          where: { id: id },
          data: {
            duration: duration ?? "",
            url: url,
            translations: {
              upsert: {
                where: {
                  documentId_locale: {
                    documentId: id!,
                    locale,
                  },
                },
                create: {
                  title: title,
                  locale,
                  slug: customSlug,
                },
                update: {
                  title,
                  slug: customSlug,
                },
              },
            },
          },
          include: {
            translations: { where: { locale: locale } },
          },
        });

        return updatedData;
      });

      return updateData;
    } catch (error) {
      console.error("updateYoutube error:", error);
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

export const updateYoutubeImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId, id } = parsedInput;
      const existingData = await db.youtube.findUnique({
        where: { id: id, isDeleted: false },
      });
      if (!existingData) {
        throw new Error("Video tapılmadı");
      }

      const updateData = await db.youtube.update({
        where: { id: id },
        data: {
          imageId: Number(imageId),
        },
      });
      return updateData;
    } catch (error) {
      console.error("updateYoutubeImage error:", error);
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
