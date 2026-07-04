/*
  Warnings:

  - You are about to drop the column `subDescripton` on the `AboutMainTranslations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AboutMainTranslations" DROP COLUMN "subDescripton",
ADD COLUMN     "shortDescription" TEXT;
