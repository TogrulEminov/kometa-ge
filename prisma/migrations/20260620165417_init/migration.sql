-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('ACTIVE', 'PLANNED');

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "status" "BranchStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchTranslation" (
    "id" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "locale" "Locales" NOT NULL DEFAULT 'en',
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_isoCode_key" ON "Branch"("isoCode");

-- CreateIndex
CREATE INDEX "Branch_isoCode_idx" ON "Branch"("isoCode");

-- CreateIndex
CREATE INDEX "Branch_isDeleted_idx" ON "Branch"("isDeleted");

-- CreateIndex
CREATE INDEX "Branch_createdAt_idx" ON "Branch"("createdAt");

-- CreateIndex
CREATE INDEX "Branch_userId_idx" ON "Branch"("userId");

-- CreateIndex
CREATE INDEX "Branch_isDeleted_status_idx" ON "Branch"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "BranchTranslation_locale_idx" ON "BranchTranslation"("locale");

-- CreateIndex
CREATE INDEX "BranchTranslation_documentId_idx" ON "BranchTranslation"("documentId");

-- CreateIndex
CREATE INDEX "BranchTranslation_countryName_idx" ON "BranchTranslation"("countryName");

-- CreateIndex
CREATE UNIQUE INDEX "BranchTranslation_documentId_locale_key" ON "BranchTranslation"("documentId", "locale");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchTranslation" ADD CONSTRAINT "BranchTranslation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
