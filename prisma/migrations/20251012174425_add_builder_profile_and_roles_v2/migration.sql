/*
  Warnings:

  - The values [CONTACTED,WON,LOST,QUALIFIED] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ASAP,THIS_MONTH] on the enum `Urgency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `filledAt` on the `Job` table. All the data in the column will be lost.
  - The `tier` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `aiEstimateHigh` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `aiEstimateLow` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `aiNotes` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `budgetMax` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `budgetMin` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `consent` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `propertyAge` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobIntro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobTradeTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TradeTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contact` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BUILDER', 'CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('DRAFT', 'APPROVED');

-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('NEW', 'PENDING', 'QUOTED', 'CLOSED');
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Urgency_new" AS ENUM ('FLEXIBLE', 'SOON', 'URGENT');
ALTER TABLE "Lead" ALTER COLUMN "urgency" TYPE "Urgency_new" USING ("urgency"::text::"Urgency_new");
ALTER TYPE "Urgency" RENAME TO "Urgency_old";
ALTER TYPE "Urgency_new" RENAME TO "Urgency";
DROP TYPE "Urgency_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobIntro" DROP CONSTRAINT "JobIntro_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobTradeTag" DROP CONSTRAINT "JobTradeTag_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobTradeTag" DROP CONSTRAINT "JobTradeTag_tradeId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Lead_userId_status_idx";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "filledAt",
ADD COLUMN     "visibleUntil" TIMESTAMP(3),
DROP COLUMN "tier",
ADD COLUMN     "tier" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT,
ALTER COLUMN "views" DROP NOT NULL,
ALTER COLUMN "contactUnlocks" DROP NOT NULL,
ALTER COLUMN "allocCap" DROP NOT NULL,
ALTER COLUMN "aiSeeded" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "aiEstimateHigh",
DROP COLUMN "aiEstimateLow",
DROP COLUMN "aiNotes",
DROP COLUMN "budgetMax",
DROP COLUMN "budgetMin",
DROP COLUMN "consent",
DROP COLUMN "contactEmail",
DROP COLUMN "contactName",
DROP COLUMN "contactPhone",
DROP COLUMN "propertyAge",
DROP COLUMN "updatedAt",
ADD COLUMN     "aiQuote" JSONB,
ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "contact" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "updatedAt",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'BUILDER';

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "JobIntro";

-- DropTable
DROP TABLE "JobTradeTag";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "TradeTag";

-- DropTable
DROP TABLE "VerificationToken";

-- DropEnum
DROP TYPE "JobStatus";

-- DropEnum
DROP TYPE "JobTier";

-- CreateTable
CREATE TABLE "BuilderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "yearsExperience" INTEGER,
    "logoUrl" TEXT,
    "bio" TEXT,
    "slug" TEXT NOT NULL,
    "tradeTypes" TEXT[],
    "services" TEXT[],
    "minJobValue" INTEGER,
    "maxJobValue" INTEGER,
    "availability" TEXT,
    "postcodeBase" TEXT NOT NULL,
    "radiusKm" INTEGER,
    "areas" TEXT[],
    "portfolio" JSONB,
    "certifications" TEXT[],
    "hasInsurance" BOOLEAN NOT NULL DEFAULT false,
    "insuranceCover" TEXT,
    "notifications" JSONB,
    "profileStatus" "ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuilderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuilderProfile_userId_key" ON "BuilderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BuilderProfile_slug_key" ON "BuilderProfile"("slug");

-- CreateIndex
CREATE INDEX "BuilderProfile_profileStatus_idx" ON "BuilderProfile"("profileStatus");

-- CreateIndex
CREATE INDEX "BuilderProfile_postcodeBase_idx" ON "BuilderProfile"("postcodeBase");

-- CreateIndex
CREATE INDEX "Job_visibleUntil_idx" ON "Job"("visibleUntil");

-- CreateIndex
CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "BuilderProfile" ADD CONSTRAINT "BuilderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
