-- AlterTable
ALTER TABLE "AboutMain" ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "AboutMain" ADD CONSTRAINT "AboutMain_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
