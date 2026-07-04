-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('office', 'warehouse');

-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "branchId" TEXT,
    "type" "BranchType" DEFAULT 'office',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeTranslation" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "locale" "Locales" NOT NULL,
    "officeDocumentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Office_branchId_idx" ON "Office"("branchId");

-- CreateIndex
CREATE INDEX "Office_isDeleted_idx" ON "Office"("isDeleted");

-- CreateIndex
CREATE INDEX "Office_latitude_longitude_idx" ON "Office"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeTranslation_documentId_key" ON "OfficeTranslation"("documentId");

-- CreateIndex
CREATE INDEX "OfficeTranslation_officeDocumentId_idx" ON "OfficeTranslation"("officeDocumentId");

-- CreateIndex
CREATE INDEX "OfficeTranslation_locale_idx" ON "OfficeTranslation"("locale");

-- CreateIndex
CREATE INDEX "OfficeTranslation_city_idx" ON "OfficeTranslation"("city");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeTranslation_officeDocumentId_locale_key" ON "OfficeTranslation"("officeDocumentId", "locale");

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeTranslation" ADD CONSTRAINT "OfficeTranslation_officeDocumentId_fkey" FOREIGN KEY ("officeDocumentId") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;
