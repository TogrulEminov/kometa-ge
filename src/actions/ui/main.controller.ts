import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import {
  CategoryKey,
  CustomLocales,
  SectionKey,
  SocialMediaKey,
} from "@/services/interface/type";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAG_GROUPS } from "./cachetags";
import {
  CertificatesWhereInput,
  DirectionsWhereInput,
  PhotoGalleryWhereInput,
  ServicesWhereInput,
  YoutubeWhereInput,
} from "@/generated/prisma/models";

export async function fetchHeroInfo({ locale }: { locale: CustomLocales }) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.HERO);
  return db.heroInfo.findFirst({
    where: {
      key: "main",
      translations: {
        some: {
          locale: locale,
        },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      videoUrl: FILE_SELECT,
      service: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale: locale,
            },
          },
        },
        select: {
          id: true,
          imageUrl: FILE_SELECT,
          translations: {
            where: { locale },
            select: {
              title: true,
              slug: true,
              shortDescription: true,
              locale: true,
            },
          },
        },
      },
      translations: {
        where: {
          locale: locale,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          subTitle: true,
          description: true,
          locale: true,
        },
      },
    },
  });
}
export async function fetchServices({
  pageNumber,
  locale,
}: {
  pageNumber: number;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SERVICES);
  const whereAction: ServicesWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale,
      },
    },
  };
  const customPageSize = 12;
  const skip = (pageNumber - 1) * customPageSize;
  const take = customPageSize;

  const [data, totalCount] = await Promise.all([
    db.services.findMany({
      where: whereAction,
      select: {
        id: true,
        imageUrl: FILE_SELECT,
        iconUrl: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            shortDescription: true,
            slug: true,
            locale: true,
          },
        },
        subServices: {
          where: {
            isDeleted: false,
            translations: {
              some: {
                locale,
              },
            },
          },
          select: {
            id: true,
            iconsUrl: true,
            translations: {
              where: { locale },
              select: {
                title: true,
                slug: true,
                locale: true,
              },
            },
          },
        },
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.services.count({ where: whereAction }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    data: data ?? [],
    paginations: {
      page: pageNumber,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}
export async function fetchServicesRelated({
  category,
  locale,
}: {
  category: string;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SERVICES);
  const whereAction: ServicesWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale,
        NOT: {
          slug: category,
        },
      },
    },
  };

  return db.services.findMany({
    where: whereAction,
    select: {
      id: true,
      iconUrl: true,
      imageUrl: FILE_SELECT,
      translations: {
        where: { locale },
        select: {
          id: true,
          title: true,
          shortDescription: true,
          slug: true,
          locale: true,
        },
      },
      subServices: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale,
            },
          },
        },
        select: {
          id: true,
          iconsUrl: true,
          imageUrl: FILE_SELECT,
          translations: {
            where: { locale },
            select: {
              title: true,
              slug: true,
              locale: true,
            },
          },
        },
      },
    },
    orderBy: { orderNumber: "asc" },
  });
}

export async function fetchDirections({
  pageNumber,
  locale,
}: {
  pageNumber: number;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.DIRECTIONS);
  const whereAction: DirectionsWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale,
      },
    },
  };
  const customPageSize = 12;
  const skip = (pageNumber - 1) * customPageSize;
  const take = customPageSize;

  const [data, totalCount] = await Promise.all([
    db.directions.findMany({
      where: whereAction,
      select: {
        id: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            navTitle: true,
            shortDescription: true,
            locale: true,
            slug: true,
          },
        },
        imageUrl: FILE_SELECT,
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.directions.count({ where: whereAction }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    data: data ?? [],
    paginations: {
      page: pageNumber,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}
export async function fetchCertificates({
  pageNumber,
  locale,
}: {
  pageNumber: number;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.CERTIFICATES);
  const whereAction: CertificatesWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale,
      },
    },
  };
  const customPageSize = 12;
  const skip = (pageNumber - 1) * customPageSize;
  const take = customPageSize;

  const [data, totalCount] = await Promise.all([
    db.certificates.findMany({
      where: whereAction,
      select: {
        id: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            description: true,
            locale: true,
            slug: true,
          },
        },
        imageUrl: FILE_SELECT,
        gallery: FILE_SELECT,
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.certificates.count({ where: whereAction }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    data: data ?? [],
    paginations: {
      page: pageNumber,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}
export async function fetchPhotoGallery({
  pageNumber,
  locale,
}: {
  pageNumber: number;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.PHOTO_GALLERY);
  const whereAction: PhotoGalleryWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale,
      },
    },
  };
  const customPageSize = 12;
  const skip = (pageNumber - 1) * customPageSize;
  const take = customPageSize;

  const [data, totalCount] = await Promise.all([
    db.photoGallery.findMany({
      where: whereAction,
      select: {
        id: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            description: true,
            locale: true,
            slug: true,
          },
        },
        imageUrl: FILE_SELECT,
        gallery: FILE_SELECT,
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.photoGallery.count({ where: whereAction }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    data: data ?? [],
    paginations: {
      page: pageNumber,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}
export async function fetchVideoGallery({
  pageNumber,
  locale,
}: {
  pageNumber: number;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.VIDEO_GALLERY);
  const whereAction: YoutubeWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale,
      },
    },
  };
  const customPageSize = 12;
  const skip = (pageNumber - 1) * customPageSize;
  const take = customPageSize;

  const [data, totalCount] = await Promise.all([
    db.youtube.findMany({
      where: whereAction,
      select: {
        id: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            locale: true,
            slug: true,
          },
        },
        imageUrl: FILE_SELECT,
        url: true,
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.youtube.count({ where: whereAction }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    data: data ?? [],
    paginations: {
      page: pageNumber,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}
export async function fetchAboutHomeInfo({
  locale,
}: {
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.ABOUT_HOME);
  return db.aboutHome.findFirst({
    where: {
      key: "main",
      translations: {
        some: {
          locale: locale,
        },
      },
    },
    select: {
      imageUrl: FILE_SELECT,
      translations: {
        where: {
          locale: locale,
        },
        select: {
          id: true,
          title: true,
          subTitle: true,
          description: true,
          locale: true,
          features: true,
        },
      },
    },
  });
}
export async function fetchAboutMainInfo({
  locale,
}: {
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.ABOUT_MAIN);
  return db.aboutMain.findFirst({
    where: {
      key: "main",
      translations: {
        some: {
          locale: locale,
        },
      },
    },
    select: {
      imageUrl: FILE_SELECT,
      gallery: FILE_SELECT,
      branches: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale,
            },
          },
        },
        select: {
          id: true,
          isoCode: true,
          status: true,
          offices: {
            where: {
              isDeleted: false,
              translations: {
                some: {
                  locale,
                },
              },
            },
            select: {
              type: true,
              translations: {
                where: {
                  locale,
                },
                select: {
                  id: true,
                  address: true,
                  city: true,
                  locale: true,
                },
              },
            },
          },
          translations: {
            where: {
              locale,
            },
            select: {
              countryName: true,
              locale: true,
            },
          },
        },
      },
      translations: {
        where: {
          locale: locale,
        },
        select: {
          id: true,
          title: true,
          subTitle: true,
          description: true,
          locale: true,
          hightlight: true,
          shortDescription: true,
        },
      },
    },
  });
}
export async function fetchFeaturesInfo({ locale }: { locale: CustomLocales }) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.FEATURES);
  return db.features.findFirst({
    where: {
      key: "main",
      translations: {
        some: {
          locale: locale,
        },
      },
    },
    select: {
      imageUrl: FILE_SELECT,
      translations: {
        where: {
          locale: locale,
        },
        select: {
          id: true,
          title: true,
          subTitle: true,
          description: true,
          locale: true,
        },
      },
    },
  });
}
export async function fetchWorkProcessInfo(locale: CustomLocales) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.WORK_PROCESS);
  return db.workProcess.findFirst({
    where: {
      key: "main",
      translations: {
        some: {
          locale: locale,
        },
      },
    },
    select: {
      imageUrl: FILE_SELECT,
      translations: {
        where: {
          locale: locale,
        },
        select: {
          id: true,
          title: true,
          subTitle: true,
          description: true,
          locale: true,
        },
      },
    },
  });
}
export async function fetchFag({ locale }: { locale: CustomLocales }) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.FAQ);
  return db.faq.findMany({
    where: {
      isDeleted: false,
      translations: {
        some: {
          locale: locale,
        },
      },
    },
    select: {
      id: true,
      translations: {
        where: { locale },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          locale: true,
        },
      },
    },
    orderBy: { orderNumber: "asc" },
  });
}
export async function fetchContactInformation(locale: CustomLocales) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.CONTACT_INFORMATION);
  return db.contactInformation.findFirst({
    where: {
      key: "main",
    },
    select: {
      id: true,
      phone: true,
      email: true,
      adressLink: true,
      whatsapp: true,
      latitude: true,
      longitude: true,
      translations: {
        where: { locale },
        select: { id: true, adress: true, locale: true },
      },
    },
  });
}
export async function fetchSubServices({
  slug,
  category,
  locale,
}: {
  slug: string;
  category: string;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SUB_SERVICES);
  return db.subServices.findFirst({
    where: {
      services: {
        isDeleted: false,
        translations: {
          some: {
            locale: locale,
            slug: category,
          },
        },
      },
      translations: {
        some: {
          locale: locale,
          slug,
        },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      gallery: FILE_SELECT,
      iconsUrl: true,
      services: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale,
            },
          },
        },
        select: {
          id: true,
          imageUrl: FILE_SELECT,
          iconUrl: true,
          translations: {
            where: { locale, slug: category },
            select: {
              title: true,
              id: true,
              slug: true,
              locale: true,
              shortDescription: true,
            },
          },
        },
      },
      translations: {
        where: { locale },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          locale: true,
          shortDescription: true,
        },
      },
    },
  });
}
export async function fetchRelatedSubServices({
  category,
  locale,
  slug,
}: {
  category: string;
  locale: CustomLocales;
  slug: string;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SUB_SERVICES);
  return db.subServices.findMany({
    where: {
      isDeleted: false,
      services: {
        isDeleted: false,
        translations: {
          some: {
            locale,
            slug: category,
          },
        },
      },
      translations: {
        some: {
          locale,
          slug: {
            not: slug,
          },
        },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      gallery: FILE_SELECT,
      iconsUrl: true,
      services: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale,
            },
          },
        },
        select: {
          id: true,
          imageUrl: FILE_SELECT,
          iconUrl: true,
          translations: {
            where: { locale, slug: category },
            select: { title: true, id: true, slug: true, locale: true },
          },
        },
      },
      translations: {
        where: { locale },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          locale: true,
          shortDescription: true,
        },
      },
    },
    orderBy: { orderNumber: "asc" },
  });
}
export async function fetchServicesDetailMain({
  locale,
  slug,
}: {
  locale: CustomLocales;
  slug: string;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SERVICES);
  return db.services.findFirst({
    where: {
      isDeleted: false,
      translations: {
        some: { locale, slug },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      gallery: FILE_SELECT,
      iconUrl: true,
      subServices: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale,
            },
          },
        },
        select: {
          id: true,
          iconsUrl: true,
          imageUrl: FILE_SELECT,
          gallery: FILE_SELECT,
          translations: {
            where: { locale },
            select: {
              id: true,
              title: true,
              slug: true,
              locale: true,
              description: true,
              shortDescription: true,
            },
          },
        },
      },
      translations: {
        where: { locale, slug },
        select: {
          id: true,
          title: true,
          slug: true,
          locale: true,
          shortDescription: true,
          description: true,
        },
      },
    },
  });
}
export async function fetchDirectionsDetailMain({
  locale,
  slug,
}: {
  locale: CustomLocales;
  slug: string;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.DIRECTIONS);
  return db.directions.findFirst({
    where: {
      isDeleted: false,
      translations: {
        some: { locale, slug },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      route: true,
      translations: {
        where: { locale, slug },
        select: {
          id: true,
          title: true,
          slug: true,
          locale: true,
          shortDescription: true,
          description: true,
          navTitle: true,
        },
      },
    },
  });
}

export async function fetchSocials() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SOCIAL_MEDIA);
  return db.social.findMany({
    select: {
      id: true,
      socialName: true,
      socialLink: true,
      iconName: true,
    },
  });
}
export async function fetchSocialsByKey({ key }: { key: SocialMediaKey }) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SOCIAL_MEDIA);
  return db.social.findFirst({
    where: {
      iconName: key,
    },
    select: {
      id: true,
      socialName: true,
      socialLink: true,
      iconName: true,
    },
  });
}
export async function fetchSectionByKeys({
  locale,
  key,
}: {
  key: SectionKey;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SECTION_CONTENT);
  return db.sectionContent.findFirst({
    where: {
      isDeleted: false,
      key: key,
    },
    select: {
      id: true,
      translations: {
        where: {
          locale,
        },
        select: {
          description: true,
          highlightWord: true,
          locale: true,
          title: true,
          subTitle: true,
          slug: true,
        },
      },
    },
  });
}
export async function fetchCategoriesByKey({
  locale,
  key,
}: {
  key: CategoryKey;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.CATEGORIES);
  return db.categories.findFirst({
    where: {
      isDeleted: false,
      slug: key,
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      translations: {
        where: {
          locale,
        },
        select: {
          id: true,
          title: true,
          description: true,
          locale: true,
          seo: {
            select: {
              id: true,
              metaDescription: true,
              metaKeywords: true,
              metaTitle: true,
            },
          },
        },
      },
    },
  });
}
// meta
export async function fetchServicesMainSeo({
  locale,
  slug,
}: {
  locale: CustomLocales;
  slug: string;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SERVICES);
  return db.services.findFirst({
    where: {
      isDeleted: false,
      translations: {
        some: { locale, slug },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      translations: {
        select: {
          id: true,
          title: true,
          locale: true,
          shortDescription: true,
          slug: true,
          seo: {
            select: {
              id: true,
              metaDescription: true,
              metaKeywords: true,
              metaTitle: true,
            },
          },
        },
      },
    },
  });
}
export async function fetchDirectionsSeo({
  locale,
  slug,
}: {
  locale: CustomLocales;
  slug: string;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.DIRECTIONS);
  return db.directions.findFirst({
    where: {
      isDeleted: false,
      translations: {
        some: { locale, slug },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      translations: {
        select: {
          id: true,
          title: true,
          slug: true,
          locale: true,
          shortDescription: true,
          seo: {
            select: {
              id: true,
              metaDescription: true,
              metaKeywords: true,
              metaTitle: true,
            },
          },
        },
      },
    },
  });
}
export async function fetchSubServicesSeo({
  slug,
  category,
  locale,
}: {
  slug: string;
  category: string;
  locale: CustomLocales;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG_GROUPS.SUB_SERVICES);
  return db.subServices.findFirst({
    where: {
      services: {
        isDeleted: false,
        translations: {
          some: {
            locale: locale,
            slug: category,
          },
        },
      },
      translations: {
        some: {
          locale: locale,
          slug,
        },
      },
    },
    select: {
      id: true,
      imageUrl: FILE_SELECT,
      gallery: FILE_SELECT,
      iconsUrl: true,
      services: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale,
            },
          },
        },
        select: {
          id: true,
          imageUrl: FILE_SELECT,
          translations: {
            select: {
              title: true,
              id: true,
              shortDescription: true,
              slug: true,
              locale: true,
            },
          },
        },
      },
      translations: {
        select: {
          id: true,
          title: true,
          slug: true,
          locale: true,
          shortDescription: true,
          seo: {
            select: {
              id: true,
              metaDescription: true,
              metaKeywords: true,
              metaTitle: true,
            },
          },
        },
      },
    },
  });
}
