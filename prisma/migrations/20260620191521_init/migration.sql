-- AlterTable
ALTER TABLE "File" ADD COLUMN     "certificatesId" TEXT;

-- CreateTable
CREATE TABLE "Certificates" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "imageId" INTEGER,
    "orderNumber" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificatesTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificatesTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificates_imageId_key" ON "Certificates"("imageId");

-- CreateIndex
CREATE INDEX "Certificates_isDeleted_orderNumber_idx" ON "Certificates"("isDeleted", "orderNumber");

-- CreateIndex
CREATE INDEX "Certificates_userId_isDeleted_idx" ON "Certificates"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_locale_idx" ON "CertificatesTranslations"("locale");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_documentId_idx" ON "CertificatesTranslations"("documentId");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_slug_idx" ON "CertificatesTranslations"("slug");

-- CreateIndex
CREATE INDEX "CertificatesTranslations_title_idx" ON "CertificatesTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CertificatesTranslations_documentId_locale_key" ON "CertificatesTranslations"("documentId", "locale");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_certificatesId_fkey" FOREIGN KEY ("certificatesId") REFERENCES "Certificates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificatesTranslations" ADD CONSTRAINT "CertificatesTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
