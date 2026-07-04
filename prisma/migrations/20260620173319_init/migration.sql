/*
  Warnings:

  - You are about to drop the column `latitude` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Office` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Office_latitude_longitude_idx";

-- AlterTable
ALTER TABLE "Office" DROP COLUMN "latitude",
DROP COLUMN "longitude";
