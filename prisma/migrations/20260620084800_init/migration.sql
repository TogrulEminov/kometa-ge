/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `Features` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Features" ADD COLUMN     "imageId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Features_imageId_key" ON "Features"("imageId");

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
