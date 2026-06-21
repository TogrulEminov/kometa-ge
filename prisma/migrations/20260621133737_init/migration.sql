/*
  Warnings:

  - You are about to drop the column `serviceId` on the `AboutMain` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AboutMain" DROP CONSTRAINT "AboutMain_serviceId_fkey";

-- AlterTable
ALTER TABLE "AboutMain" DROP COLUMN "serviceId";

-- AlterTable
ALTER TABLE "HeroInfo" ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "HeroInfo" ADD CONSTRAINT "HeroInfo_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
