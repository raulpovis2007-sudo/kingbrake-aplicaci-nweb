-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BannerType" ADD VALUE 'HERO';
ALTER TYPE "BannerType" ADD VALUE 'NOSOTROS_VIDEO';

-- AlterTable
ALTER TABLE "Distributor" ADD COLUMN     "image" TEXT;
