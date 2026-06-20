-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "aboutMainId" TEXT;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_aboutMainId_fkey" FOREIGN KEY ("aboutMainId") REFERENCES "AboutMain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
