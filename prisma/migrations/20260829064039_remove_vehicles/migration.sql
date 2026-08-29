/*
  Warnings:

  - You are about to drop the `ProductCompatibility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleBrand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductCompatibility" DROP CONSTRAINT "ProductCompatibility_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCompatibility" DROP CONSTRAINT "ProductCompatibility_vehicleModelId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleModel" DROP CONSTRAINT "VehicleModel_brandId_fkey";

-- DropTable
DROP TABLE "ProductCompatibility";

-- DropTable
DROP TABLE "VehicleBrand";

-- DropTable
DROP TABLE "VehicleModel";
