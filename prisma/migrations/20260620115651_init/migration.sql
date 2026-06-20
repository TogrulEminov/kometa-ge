-- AlterTable
ALTER TABLE "File" ADD COLUMN     "aboutMainId" TEXT;

-- CreateTable
CREATE TABLE "AboutMain" (
    "id" TEXT NOT NULL,
    "imageId" INTEGER,
    "userId" TEXT,
    "key" "StaticKey" NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutMain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutMainTranslations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "description" JSONB,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutMainTranslations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutMain_imageId_key" ON "AboutMain"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutMain_key_key" ON "AboutMain"("key");

-- CreateIndex
CREATE INDEX "AboutMain_createdAt_idx" ON "AboutMain"("createdAt");

-- CreateIndex
CREATE INDEX "AboutMain_userId_idx" ON "AboutMain"("userId");

-- CreateIndex
CREATE INDEX "AboutMainTranslations_locale_idx" ON "AboutMainTranslations"("locale");

-- CreateIndex
CREATE INDEX "AboutMainTranslations_documentId_idx" ON "AboutMainTranslations"("documentId");

-- CreateIndex
CREATE INDEX "AboutMainTranslations_title_idx" ON "AboutMainTranslations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "AboutMainTranslations_documentId_locale_key" ON "AboutMainTranslations"("documentId", "locale");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_aboutMainId_fkey" FOREIGN KEY ("aboutMainId") REFERENCES "AboutMain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutMain" ADD CONSTRAINT "AboutMain_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutMain" ADD CONSTRAINT "AboutMain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutMainTranslations" ADD CONSTRAINT "AboutMainTranslations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "AboutMain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
