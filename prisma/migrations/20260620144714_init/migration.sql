/*
  Warnings:

  - Made the column `servicesId` on table `SubServices` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SubServices" DROP CONSTRAINT "SubServices_servicesId_fkey";

-- AlterTable
ALTER TABLE "SubServices" ALTER COLUMN "servicesId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SubServices" ADD CONSTRAINT "SubServices_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
