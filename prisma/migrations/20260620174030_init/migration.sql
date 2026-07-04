/*
  Warnings:

  - You are about to drop the column `officeDocumentId` on the `OfficeTranslation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentId,locale]` on the table `OfficeTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OfficeTranslation" DROP CONSTRAINT "OfficeTranslation_officeDocumentId_fkey";

-- DropIndex
DROP INDEX "OfficeTranslation_documentId_key";

-- DropIndex
DROP INDEX "OfficeTranslation_officeDocumentId_idx";

-- DropIndex
DROP INDEX "OfficeTranslation_officeDocumentId_locale_key";

-- AlterTable
ALTER TABLE "OfficeTranslation" DROP COLUMN "officeDocumentId",
ALTER COLUMN "documentId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Office_orderNumber_idx" ON "Office"("orderNumber");

-- CreateIndex
CREATE INDEX "OfficeTranslation_documentId_idx" ON "OfficeTranslation"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeTranslation_documentId_locale_key" ON "OfficeTranslation"("documentId", "locale");

-- AddForeignKey
ALTER TABLE "OfficeTranslation" ADD CONSTRAINT "OfficeTranslation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;
