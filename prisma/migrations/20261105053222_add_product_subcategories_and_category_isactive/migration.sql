-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "_ProductSubcategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductSubcategories_AB_unique" ON "_ProductSubcategories"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductSubcategories_B_index" ON "_ProductSubcategories"("B");

-- AddForeignKey
ALTER TABLE "_ProductSubcategories" ADD CONSTRAINT "_ProductSubcategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSubcategories" ADD CONSTRAINT "_ProductSubcategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed: populate subcategories from existing categoryId (only for subcategories, not parents)
INSERT INTO "_ProductSubcategories" ("A", "B")
SELECT p."categoryId", p."id"
FROM "Product" p
INNER JOIN "Category" c ON c."id" = p."categoryId"
WHERE c."parentId" IS NOT NULL;
