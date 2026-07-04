/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `HeroInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HeroInfo" ADD COLUMN     "videoId" INTEGER;

-- AlterTable
ALTER TABLE "ServicesTranslations" ADD COLUMN     "shortDescription" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "HeroInfo_videoId_key" ON "HeroInfo"("videoId");

-- AddForeignKey
ALTER TABLE "HeroInfo" ADD CONSTRAINT "HeroInfo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
