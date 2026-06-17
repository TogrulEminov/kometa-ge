-- CreateEnum
CREATE TYPE "Locales" AS ENUM ('en', 'ka');

-- CreateEnum
CREATE TYPE "StaticKey" AS ENUM ('main');

-- CreateEnum
CREATE TYPE "EnumKey" AS ENUM ('contact');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "servicesId" TEXT,
    "subServicesId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seo" (
    "id" TEXT NOT NULL,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "metaTitle" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "imageId" INTEGER,

    CONSTRAINT "Seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" TEXT NOT NULL,
    "socialName" TEXT,
    "socialLink" TEXT,
    "iconName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "seoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionContent" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "userId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionContentTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "subTitle" TEXT,
    "highlightWord" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "SectionContentTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroInfo" (
    "id" TEXT NOT NULL,
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "key" "StaticKey" NOT NULL DEFAULT 'main',

    CONSTRAINT "HeroInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroInfoTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroInfoTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutHome" (
    "id" TEXT NOT NULL,
    "imageId" INTEGER,
    "userId" TEXT,
    "key" "StaticKey" NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutHomeTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutHomeTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Features" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "key" "StaticKey" NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturesTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkProcess" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "key" "StaticKey" NOT NULL DEFAULT 'main',
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkProcessTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkProcessTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Youtube" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT NOT NULL,
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Youtube_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 1,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqTranslations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "FaqTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInformation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "adressLink" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "userId" TEXT,
    "key" "StaticKey" NOT NULL DEFAULT 'main',

    CONSTRAINT "ContactInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInformationTranslation" (
    "id" TEXT NOT NULL,
    "adress" TEXT,
    "documentId" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInformationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "imageId" INTEGER,
    "orderNumber" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "seoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubServices" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "imageId" INTEGER,
    "orderNumber" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT,
    "iconsUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "servicesId" TEXT,

    CONSTRAINT "SubServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubServicesTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "seoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubServicesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enum" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderNumber" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "key" "EnumKey" NOT NULL,

    CONSTRAINT "Enum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnumTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnumTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Directions" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "imageId" INTEGER,
    "orderNumber" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT,
    "route" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Directions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectionsTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "navTitle" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "seoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectionsTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileKey_key" ON "File"("fileKey");

-- CreateIndex
CREATE INDEX "File_createdAt_mimeType_idx" ON "File"("createdAt", "mimeType");

-- CreateIndex
CREATE UNIQUE INDEX "Seo_imageId_key" ON "Seo"("imageId");

-- CreateIndex
CREATE INDEX "Seo_locale_idx" ON "Seo"("locale");

-- CreateIndex
CREATE INDEX "Seo_imageId_idx" ON "Seo"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Social_socialName_key" ON "Social"("socialName");

-- CreateIndex
CREATE UNIQUE INDEX "Social_socialLink_key" ON "Social"("socialLink");

-- CreateIndex
CREATE INDEX "Social_createdAt_idx" ON "Social"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_imageId_key" ON "Categories"("imageId");

-- CreateIndex
CREATE INDEX "Categories_isDeleted_idx" ON "Categories"("isDeleted");

-- CreateIndex
CREATE INDEX "Categories_slug_isDeleted_idx" ON "Categories"("slug", "isDeleted");

-- CreateIndex
CREATE INDEX "Categories_userId_isDeleted_idx" ON "Categories"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "Categories_createdAt_idx" ON "Categories"("createdAt");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_locale_idx" ON "CategoriesTranslations"("locale");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_documentId_idx" ON "CategoriesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_seoId_idx" ON "CategoriesTranslations"("seoId");

-- CreateIndex
CREATE INDEX "CategoriesTranslations_title_idx" ON "CategoriesTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriesTranslations_documentId_locale_key" ON "CategoriesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "SectionContent_key_key" ON "SectionContent"("key");

-- CreateIndex
CREATE INDEX "SectionContent_isDeleted_idx" ON "SectionContent"("isDeleted");

-- CreateIndex
CREATE INDEX "SectionContent_createdAt_idx" ON "SectionContent"("createdAt");

-- CreateIndex
CREATE INDEX "SectionContent_key_idx" ON "SectionContent"("key");

-- CreateIndex
CREATE INDEX "SectionContent_userId_idx" ON "SectionContent"("userId");

-- CreateIndex
CREATE INDEX "SectionContent_isDeleted_key_idx" ON "SectionContent"("isDeleted", "key");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_title_idx" ON "SectionContentTranslations"("title");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_locale_idx" ON "SectionContentTranslations"("locale");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_documentId_idx" ON "SectionContentTranslations"("documentId");

-- CreateIndex
CREATE INDEX "SectionContentTranslations_slug_idx" ON "SectionContentTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SectionContentTranslations_documentId_locale_key" ON "SectionContentTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "HeroInfo_imageId_key" ON "HeroInfo"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "HeroInfo_key_key" ON "HeroInfo"("key");

-- CreateIndex
CREATE INDEX "HeroInfo_createdAt_idx" ON "HeroInfo"("createdAt");

-- CreateIndex
CREATE INDEX "HeroInfo_userId_idx" ON "HeroInfo"("userId");

-- CreateIndex
CREATE INDEX "HeroInfoTranslations_locale_idx" ON "HeroInfoTranslations"("locale");

-- CreateIndex
CREATE INDEX "HeroInfoTranslations_documentId_idx" ON "HeroInfoTranslations"("documentId");

-- CreateIndex
CREATE INDEX "HeroInfoTranslations_slug_idx" ON "HeroInfoTranslations"("slug");

-- CreateIndex
CREATE INDEX "HeroInfoTranslations_title_idx" ON "HeroInfoTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "HeroInfoTranslations_documentId_locale_key" ON "HeroInfoTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "AboutHome_imageId_key" ON "AboutHome"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutHome_key_key" ON "AboutHome"("key");

-- CreateIndex
CREATE INDEX "AboutHome_createdAt_idx" ON "AboutHome"("createdAt");

-- CreateIndex
CREATE INDEX "AboutHome_userId_idx" ON "AboutHome"("userId");

-- CreateIndex
CREATE INDEX "AboutHomeTranslations_locale_idx" ON "AboutHomeTranslations"("locale");

-- CreateIndex
CREATE INDEX "AboutHomeTranslations_documentId_idx" ON "AboutHomeTranslations"("documentId");

-- CreateIndex
CREATE INDEX "AboutHomeTranslations_title_idx" ON "AboutHomeTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "AboutHomeTranslations_documentId_locale_key" ON "AboutHomeTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Features_key_key" ON "Features"("key");

-- CreateIndex
CREATE INDEX "Features_createdAt_idx" ON "Features"("createdAt");

-- CreateIndex
CREATE INDEX "Features_userId_idx" ON "Features"("userId");

-- CreateIndex
CREATE INDEX "FeaturesTranslations_locale_idx" ON "FeaturesTranslations"("locale");

-- CreateIndex
CREATE INDEX "FeaturesTranslations_documentId_idx" ON "FeaturesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "FeaturesTranslations_title_idx" ON "FeaturesTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturesTranslations_documentId_locale_key" ON "FeaturesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProcess_key_key" ON "WorkProcess"("key");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProcess_imageId_key" ON "WorkProcess"("imageId");

-- CreateIndex
CREATE INDEX "WorkProcess_createdAt_idx" ON "WorkProcess"("createdAt");

-- CreateIndex
CREATE INDEX "WorkProcess_userId_idx" ON "WorkProcess"("userId");

-- CreateIndex
CREATE INDEX "WorkProcessTranslations_locale_idx" ON "WorkProcessTranslations"("locale");

-- CreateIndex
CREATE INDEX "WorkProcessTranslations_documentId_idx" ON "WorkProcessTranslations"("documentId");

-- CreateIndex
CREATE INDEX "WorkProcessTranslations_title_idx" ON "WorkProcessTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProcessTranslations_documentId_locale_key" ON "WorkProcessTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Youtube_imageId_key" ON "Youtube"("imageId");

-- CreateIndex
CREATE INDEX "Youtube_isDeleted_idx" ON "Youtube"("isDeleted");

-- CreateIndex
CREATE INDEX "Youtube_createdAt_idx" ON "Youtube"("createdAt");

-- CreateIndex
CREATE INDEX "Youtube_userId_idx" ON "Youtube"("userId");

-- CreateIndex
CREATE INDEX "Youtube_isDeleted_createdAt_idx" ON "Youtube"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_locale_idx" ON "YoutubeTranslations"("locale");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_documentId_idx" ON "YoutubeTranslations"("documentId");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_slug_idx" ON "YoutubeTranslations"("slug");

-- CreateIndex
CREATE INDEX "YoutubeTranslations_title_idx" ON "YoutubeTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeTranslations_documentId_locale_key" ON "YoutubeTranslations"("documentId", "locale");

-- CreateIndex
CREATE INDEX "Faq_isDeleted_idx" ON "Faq"("isDeleted");

-- CreateIndex
CREATE INDEX "Faq_createdAt_idx" ON "Faq"("createdAt");

-- CreateIndex
CREATE INDEX "Faq_userId_idx" ON "Faq"("userId");

-- CreateIndex
CREATE INDEX "Faq_orderNumber_idx" ON "Faq"("orderNumber");

-- CreateIndex
CREATE INDEX "Faq_isDeleted_createdAt_idx" ON "Faq"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "FaqTranslations_title_idx" ON "FaqTranslations"("title");

-- CreateIndex
CREATE INDEX "FaqTranslations_locale_idx" ON "FaqTranslations"("locale");

-- CreateIndex
CREATE INDEX "FaqTranslations_documentId_idx" ON "FaqTranslations"("documentId");

-- CreateIndex
CREATE INDEX "FaqTranslations_slug_idx" ON "FaqTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FaqTranslations_documentId_locale_key" ON "FaqTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformation_key_key" ON "ContactInformation"("key");

-- CreateIndex
CREATE INDEX "ContactInformation_createdAt_idx" ON "ContactInformation"("createdAt");

-- CreateIndex
CREATE INDEX "ContactInformation_phone_idx" ON "ContactInformation"("phone");

-- CreateIndex
CREATE INDEX "ContactInformation_email_idx" ON "ContactInformation"("email");

-- CreateIndex
CREATE INDEX "ContactInformation_userId_idx" ON "ContactInformation"("userId");

-- CreateIndex
CREATE INDEX "ContactInformationTranslation_locale_idx" ON "ContactInformationTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInformationTranslation_documentId_locale_key" ON "ContactInformationTranslation"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Services_imageId_key" ON "Services"("imageId");

-- CreateIndex
CREATE INDEX "Services_isDeleted_orderNumber_idx" ON "Services"("isDeleted", "orderNumber");

-- CreateIndex
CREATE INDEX "Services_userId_isDeleted_idx" ON "Services"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "ServicesTranslations_locale_idx" ON "ServicesTranslations"("locale");

-- CreateIndex
CREATE INDEX "ServicesTranslations_documentId_idx" ON "ServicesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "ServicesTranslations_slug_idx" ON "ServicesTranslations"("slug");

-- CreateIndex
CREATE INDEX "ServicesTranslations_title_idx" ON "ServicesTranslations"("title");

-- CreateIndex
CREATE INDEX "ServicesTranslations_seoId_idx" ON "ServicesTranslations"("seoId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesTranslations_documentId_locale_key" ON "ServicesTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "SubServices_imageId_key" ON "SubServices"("imageId");

-- CreateIndex
CREATE INDEX "SubServices_isDeleted_orderNumber_idx" ON "SubServices"("isDeleted", "orderNumber");

-- CreateIndex
CREATE INDEX "SubServices_userId_isDeleted_idx" ON "SubServices"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "SubServicesTranslations_locale_idx" ON "SubServicesTranslations"("locale");

-- CreateIndex
CREATE INDEX "SubServicesTranslations_documentId_idx" ON "SubServicesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "SubServicesTranslations_slug_idx" ON "SubServicesTranslations"("slug");

-- CreateIndex
CREATE INDEX "SubServicesTranslations_title_idx" ON "SubServicesTranslations"("title");

-- CreateIndex
CREATE INDEX "SubServicesTranslations_seoId_idx" ON "SubServicesTranslations"("seoId");

-- CreateIndex
CREATE UNIQUE INDEX "SubServicesTranslations_documentId_locale_key" ON "SubServicesTranslations"("documentId", "locale");

-- CreateIndex
CREATE INDEX "Enum_isDeleted_idx" ON "Enum"("isDeleted");

-- CreateIndex
CREATE INDEX "Enum_createdAt_idx" ON "Enum"("createdAt");

-- CreateIndex
CREATE INDEX "Enum_userId_idx" ON "Enum"("userId");

-- CreateIndex
CREATE INDEX "Enum_orderNumber_idx" ON "Enum"("orderNumber");

-- CreateIndex
CREATE INDEX "EnumTranslations_title_idx" ON "EnumTranslations"("title");

-- CreateIndex
CREATE INDEX "EnumTranslations_locale_idx" ON "EnumTranslations"("locale");

-- CreateIndex
CREATE INDEX "EnumTranslations_documentId_idx" ON "EnumTranslations"("documentId");

-- CreateIndex
CREATE INDEX "EnumTranslations_slug_idx" ON "EnumTranslations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EnumTranslations_documentId_locale_key" ON "EnumTranslations"("documentId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Directions_imageId_key" ON "Directions"("imageId");

-- CreateIndex
CREATE INDEX "Directions_isDeleted_orderNumber_idx" ON "Directions"("isDeleted", "orderNumber");

-- CreateIndex
CREATE INDEX "Directions_userId_isDeleted_idx" ON "Directions"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "DirectionsTranslations_locale_idx" ON "DirectionsTranslations"("locale");

-- CreateIndex
CREATE INDEX "DirectionsTranslations_documentId_idx" ON "DirectionsTranslations"("documentId");

-- CreateIndex
CREATE INDEX "DirectionsTranslations_slug_idx" ON "DirectionsTranslations"("slug");

-- CreateIndex
CREATE INDEX "DirectionsTranslations_title_idx" ON "DirectionsTranslations"("title");

-- CreateIndex
CREATE INDEX "DirectionsTranslations_seoId_idx" ON "DirectionsTranslations"("seoId");

-- CreateIndex
CREATE UNIQUE INDEX "DirectionsTranslations_documentId_locale_key" ON "DirectionsTranslations"("documentId", "locale");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_subServicesId_fkey" FOREIGN KEY ("subServicesId") REFERENCES "SubServices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesTranslations" ADD CONSTRAINT "CategoriesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesTranslations" ADD CONSTRAINT "CategoriesTranslations_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "Seo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionContent" ADD CONSTRAINT "SectionContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionContentTranslations" ADD CONSTRAINT "SectionContentTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SectionContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroInfo" ADD CONSTRAINT "HeroInfo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroInfo" ADD CONSTRAINT "HeroInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroInfoTranslations" ADD CONSTRAINT "HeroInfoTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "HeroInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutHome" ADD CONSTRAINT "AboutHome_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutHome" ADD CONSTRAINT "AboutHome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutHomeTranslations" ADD CONSTRAINT "AboutHomeTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "AboutHome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturesTranslations" ADD CONSTRAINT "FeaturesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProcess" ADD CONSTRAINT "WorkProcess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProcess" ADD CONSTRAINT "WorkProcess_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProcessTranslations" ADD CONSTRAINT "WorkProcessTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "WorkProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Youtube" ADD CONSTRAINT "Youtube_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Youtube" ADD CONSTRAINT "Youtube_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeTranslations" ADD CONSTRAINT "YoutubeTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Youtube"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqTranslations" ADD CONSTRAINT "FaqTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Faq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInformation" ADD CONSTRAINT "ContactInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInformationTranslation" ADD CONSTRAINT "ContactInformationTranslation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ContactInformation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesTranslations" ADD CONSTRAINT "ServicesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesTranslations" ADD CONSTRAINT "ServicesTranslations_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "Seo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubServices" ADD CONSTRAINT "SubServices_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubServices" ADD CONSTRAINT "SubServices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubServices" ADD CONSTRAINT "SubServices_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubServicesTranslations" ADD CONSTRAINT "SubServicesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SubServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubServicesTranslations" ADD CONSTRAINT "SubServicesTranslations_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "Seo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enum" ADD CONSTRAINT "Enum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnumTranslations" ADD CONSTRAINT "EnumTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Enum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directions" ADD CONSTRAINT "Directions_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directions" ADD CONSTRAINT "Directions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionsTranslations" ADD CONSTRAINT "DirectionsTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Directions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionsTranslations" ADD CONSTRAINT "DirectionsTranslations_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "Seo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
