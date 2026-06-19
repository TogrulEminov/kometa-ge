/*
  Warnings:

  - The primary key for the `FaqTranslations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "FaqTranslations" DROP CONSTRAINT "FaqTranslations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FaqTranslations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FaqTranslations_id_seq";
