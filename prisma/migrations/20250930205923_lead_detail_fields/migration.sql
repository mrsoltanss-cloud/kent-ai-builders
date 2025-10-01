-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('DETACHED', 'SEMI', 'TERRACE', 'FLAT', 'BUNGALOW', 'OTHER');

-- CreateEnum
CREATE TYPE "AgeBand" AS ENUM ('PRE_1950', 'Y1950_2000', 'POST_2000', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "FinishLevel" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('GOOD', 'LIMITED', 'SCAFFOLD_LIKELY');

-- CreateEnum
CREATE TYPE "PlanningStatus" AS ENUM ('APPROVED', 'PENDING', 'NOT_REQUIRED', 'UNSURE');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('ASAP', 'M1_3', 'M3_6', 'FLEXIBLE');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "accessLevel" "AccessLevel",
ADD COLUMN     "ageBand" "AgeBand",
ADD COLUMN     "areaSqm" INTEGER,
ADD COLUMN     "attachmentsMeta" JSONB,
ADD COLUMN     "finishLevel" "FinishLevel",
ADD COLUMN     "parking" BOOLEAN,
ADD COLUMN     "planning" "PlanningStatus",
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "propertyType" "PropertyType",
ADD COLUMN     "rooms" INTEGER,
ADD COLUMN     "structuralChanges" BOOLEAN,
ADD COLUMN     "urgency" "Urgency";
