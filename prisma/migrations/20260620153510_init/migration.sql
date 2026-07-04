/*
  Warnings:

  - A unique constraint covering the columns `[servicesId]` on the table `SubServices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SubServices" DROP CONSTRAINT "SubServices_servicesId_fkey";

-- AlterTable
ALTER TABLE "SubServices" ALTER COLUMN "servicesId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubServices_servicesId_key" ON "SubServices"("servicesId");

-- AddForeignKey
ALTER TABLE "SubServices" ADD CONSTRAINT "SubServices_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
