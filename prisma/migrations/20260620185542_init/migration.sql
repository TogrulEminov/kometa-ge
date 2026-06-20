-- AlterTable
ALTER TABLE "File" ADD COLUMN     "photoGalleryId" TEXT;

-- CreateTable
CREATE TABLE "PhotoGallery" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "imageId" INTEGER,
    "orderNumber" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoGalleryTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoGalleryTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhotoGallery_imageId_key" ON "PhotoGallery"("imageId");

-- CreateIndex
CREATE INDEX "PhotoGallery_isDeleted_orderNumber_idx" ON "PhotoGallery"("isDeleted", "orderNumber");

-- CreateIndex
CREATE INDEX "PhotoGallery_userId_isDeleted_idx" ON "PhotoGallery"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_locale_idx" ON "PhotoGalleryTranslations"("locale");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_documentId_idx" ON "PhotoGalleryTranslations"("documentId");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_slug_idx" ON "PhotoGalleryTranslations"("slug");

-- CreateIndex
CREATE INDEX "PhotoGalleryTranslations_title_idx" ON "PhotoGalleryTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoGalleryTranslations_documentId_locale_key" ON "PhotoGalleryTranslations"("documentId", "locale");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_photoGalleryId_fkey" FOREIGN KEY ("photoGalleryId") REFERENCES "PhotoGallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoGallery" ADD CONSTRAINT "PhotoGallery_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoGallery" ADD CONSTRAINT "PhotoGallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoGalleryTranslations" ADD CONSTRAINT "PhotoGalleryTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PhotoGallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
