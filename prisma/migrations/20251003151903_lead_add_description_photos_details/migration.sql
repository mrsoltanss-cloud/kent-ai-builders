-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "description" TEXT,
ADD COLUMN     "details" JSONB,
ADD COLUMN     "photos" JSONB;
