/*
  Warnings:

  - The values [FRAUDES,PROCESO] on the enum `ReelCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [INSPECTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isInspectorAvailable` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BlockedDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeviceToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InspectionPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InspectionPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InspectionPlanItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InspectionReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LegalReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleInspection` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReelCategory_new" AS ENUM ('TIPS', 'PRODUCTOS', 'INSTALACION', 'TESTIMONIOS');
ALTER TABLE "Reel" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Reel" ALTER COLUMN "category" TYPE "ReelCategory_new" USING ("category"::text::"ReelCategory_new");
ALTER TYPE "ReelCategory" RENAME TO "ReelCategory_old";
ALTER TYPE "ReelCategory_new" RENAME TO "ReelCategory";
DROP TYPE "ReelCategory_old";
ALTER TABLE "Reel" ALTER COLUMN "category" SET DEFAULT 'TIPS';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CLIENT', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "BlockedDate" DROP CONSTRAINT "BlockedDate_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_inspectionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_inspectorId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "DeviceToken" DROP CONSTRAINT "DeviceToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "InspectionPhoto" DROP CONSTRAINT "InspectionPhoto_reportId_fkey";

-- DropForeignKey
ALTER TABLE "InspectionPlanItem" DROP CONSTRAINT "InspectionPlanItem_inspectionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "InspectionReport" DROP CONSTRAINT "InspectionReport_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "LegalReport" DROP CONSTRAINT "LegalReport_completedBy_fkey";

-- DropForeignKey
ALTER TABLE "LegalReport" DROP CONSTRAINT "LegalReport_lockedBy_fkey";

-- DropForeignKey
ALTER TABLE "LegalReport" DROP CONSTRAINT "LegalReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_inspectionId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_modelId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleInspection" DROP CONSTRAINT "VehicleInspection_assignedAdminId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleInspection" DROP CONSTRAINT "VehicleInspection_assignedMechanicId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleInspection" DROP CONSTRAINT "VehicleInspection_clientId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleInspection" DROP CONSTRAINT "VehicleInspection_vehicleId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "author" SET DEFAULT 'King Brake';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "availability",
DROP COLUMN "district",
DROP COLUMN "isInspectorAvailable";

-- DropTable
DROP TABLE "BlockedDate";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "DeviceToken";

-- DropTable
DROP TABLE "InspectionPhoto";

-- DropTable
DROP TABLE "InspectionPlan";

-- DropTable
DROP TABLE "InspectionPlanItem";

-- DropTable
DROP TABLE "InspectionReport";

-- DropTable
DROP TABLE "LegalReport";

-- DropTable
DROP TABLE "Model";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Vehicle";

-- DropTable
DROP TABLE "VehicleInspection";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "InspectionResultStatus";

-- DropEnum
DROP TYPE "InspectionType";

-- DropEnum
DROP TYPE "LegalFieldStatus";

-- DropEnum
DROP TYPE "LegalReportStatus";

-- DropEnum
DROP TYPE "LegalStatus";

-- DropEnum
DROP TYPE "MechanicalStatus";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PhotoCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sku" TEXT NOT NULL,
    "images" TEXT[],
    "stock" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleBrand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "VehicleBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCompatibility" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vehicleModelId" TEXT NOT NULL,

    CONSTRAINT "ProductCompatibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distributor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "Product_featured_idx" ON "Product"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleBrand_name_key" ON "VehicleBrand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleBrand_slug_key" ON "VehicleBrand"("slug");

-- CreateIndex
CREATE INDEX "VehicleModel_brandId_idx" ON "VehicleModel"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleModel_brandId_name_key" ON "VehicleModel"("brandId", "name");

-- CreateIndex
CREATE INDEX "ProductCompatibility_productId_idx" ON "ProductCompatibility"("productId");

-- CreateIndex
CREATE INDEX "ProductCompatibility_vehicleModelId_idx" ON "ProductCompatibility"("vehicleModelId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCompatibility_productId_vehicleModelId_key" ON "ProductCompatibility"("productId", "vehicleModelId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "VehicleBrand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCompatibility" ADD CONSTRAINT "ProductCompatibility_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCompatibility" ADD CONSTRAINT "ProductCompatibility_vehicleModelId_fkey" FOREIGN KEY ("vehicleModelId") REFERENCES "VehicleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
