-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('CONTACT', 'HERO_BOOKING', 'SHIPMENT_MODAL');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');

-- CreateTable
CREATE TABLE "form_submission" (
    "id" TEXT NOT NULL,
    "type" "FormType" NOT NULL,
    "status" "FormStatus" NOT NULL DEFAULT 'NEW',
    "locale" "Locales",
    "payload" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_submission_type_status_idx" ON "form_submission"("type", "status");

-- CreateIndex
CREATE INDEX "form_submission_createdAt_idx" ON "form_submission"("createdAt");
