-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('BANNER', 'EVENT');

-- DropIndex
DROP INDEX "Banner_isActive_sortOrder_idx";

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "type" "BannerType" NOT NULL DEFAULT 'BANNER';

-- CreateIndex
CREATE INDEX "Banner_isActive_type_sortOrder_idx" ON "Banner"("isActive", "type", "sortOrder");
