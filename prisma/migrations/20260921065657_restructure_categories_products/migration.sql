/*
  Warnings:

  - You are about to drop the column `detalle` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productPrice` on the `Quote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,vehicleModelId]` on the table `ProductCompatibility` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "detalle",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "ProductCompatibility" ADD COLUMN     "vehicleModelId" TEXT,
ALTER COLUMN "vehicleGenerationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "productPrice";

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "ProductCompatibility_productId_idx" ON "ProductCompatibility"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCompatibility_productId_vehicleModelId_key" ON "ProductCompatibility"("productId", "vehicleModelId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCompatibility" ADD CONSTRAINT "ProductCompatibility_vehicleModelId_fkey" FOREIGN KEY ("vehicleModelId") REFERENCES "VehicleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
