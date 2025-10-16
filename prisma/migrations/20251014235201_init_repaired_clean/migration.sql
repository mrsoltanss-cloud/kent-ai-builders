/*
  Warnings:

  - The values [NEW] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `areas` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `hasInsurance` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceCover` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `maxJobValue` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `minJobValue` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `postcodeBase` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileStatus` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `radiusKm` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `tradeTypes` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `yearsExperience` on the `BuilderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `aiQuote` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `rooms` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `sqm` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[builderSlug]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `builderId` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'BUILDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BuilderStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'REJECTED');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('INSURANCE', 'ID', 'CERT');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('PENDING', 'CONTACTED', 'QUOTED', 'WON', 'LOST', 'CLOSED');
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "PortfolioImage" DROP CONSTRAINT "PortfolioImage_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_userId_fkey";

-- DropIndex
DROP INDEX "BuilderProfile_postcodeBase_idx";

-- DropIndex
DROP INDEX "BuilderProfile_profileStatus_idx";

-- DropIndex
DROP INDEX "BuilderProfile_slug_key";

-- DropIndex
DROP INDEX "Lead_createdAt_idx";

-- DropIndex
DROP INDEX "Lead_status_idx";

-- DropIndex
DROP INDEX "PortfolioItem_userId_position_idx";

-- AlterTable
ALTER TABLE "BuilderProfile" DROP COLUMN "areas",
DROP COLUMN "availability",
DROP COLUMN "certifications",
DROP COLUMN "company",
DROP COLUMN "hasInsurance",
DROP COLUMN "insuranceCover",
DROP COLUMN "logoUrl",
DROP COLUMN "maxJobValue",
DROP COLUMN "minJobValue",
DROP COLUMN "notifications",
DROP COLUMN "portfolio",
DROP COLUMN "postcodeBase",
DROP COLUMN "profileStatus",
DROP COLUMN "radiusKm",
DROP COLUMN "services",
DROP COLUMN "slug",
DROP COLUMN "tradeTypes",
DROP COLUMN "yearsExperience",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "completeness" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "radiusMiles" INTEGER,
ADD COLUMN     "status" "BuilderStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "trades" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "website" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "aiQuote",
DROP COLUMN "attachments",
DROP COLUMN "budget",
DROP COLUMN "contact",
DROP COLUMN "rooms",
DROP COLUMN "scope",
DROP COLUMN "sqm",
DROP COLUMN "timeline",
ADD COLUMN     "details" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "priceMax" INTEGER,
ADD COLUMN     "priceMin" INTEGER,
ALTER COLUMN "urgency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "coverUrl",
DROP COLUMN "description",
DROP COLUMN "position",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "builderId" TEXT NOT NULL,
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "builderSlug" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ALTER COLUMN "email" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "PortfolioImage";

-- DropEnum
DROP TYPE "ProfileStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "VerificationDocument" (
    "id" TEXT NOT NULL,
    "builderId" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "filename" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "status" "VerificationStatus" NOT NULL DEFAULT 'UPLOADED',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_builderSlug_key" ON "User"("builderSlug");

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_builderId_fkey" FOREIGN KEY ("builderId") REFERENCES "BuilderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_builderId_fkey" FOREIGN KEY ("builderId") REFERENCES "BuilderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
