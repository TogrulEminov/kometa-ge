-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "orderNumber" INTEGER DEFAULT 1;

-- CreateIndex
CREATE INDEX "Branch_status_idx" ON "Branch"("status");
