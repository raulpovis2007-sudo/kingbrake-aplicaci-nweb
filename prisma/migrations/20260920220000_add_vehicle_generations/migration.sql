-- 1. Create VehicleGeneration table
CREATE TABLE "VehicleGeneration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER NOT NULL,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "VehicleGeneration_pkey" PRIMARY KEY ("id")
);

-- 2. Migrate existing VehicleModel rows into VehicleGeneration
-- Each existing model becomes one generation under a deduplicated model
-- First, assign generation names based on ordering within same brand+name group

-- For each VehicleModel row, create a VehicleGeneration
INSERT INTO "VehicleGeneration" ("id", "name", "yearFrom", "yearTo", "modelId")
SELECT
  gen_random_uuid()::text,
  CASE rn
    WHEN 1 THEN 'Primera generación'
    WHEN 2 THEN 'Segunda generación'
    WHEN 3 THEN 'Tercera generación'
    WHEN 4 THEN 'Cuarta generación'
    WHEN 5 THEN 'Quinta generación'
    WHEN 6 THEN 'Sexta generación'
    WHEN 7 THEN 'Séptima generación'
    WHEN 8 THEN 'Octava generación'
    WHEN 9 THEN 'Novena generación'
    WHEN 10 THEN 'Décima generación'
    ELSE 'Generación ' || rn
  END,
  "yearFrom",
  "yearTo",
  "id"
FROM (
  SELECT "id", "name", "yearFrom", "yearTo", "brandId",
    ROW_NUMBER() OVER (PARTITION BY "brandId", "name" ORDER BY "yearFrom") AS rn
  FROM "VehicleModel"
) sub;

-- 3. Add vehicleGenerationId to ProductCompatibility (nullable first)
ALTER TABLE "ProductCompatibility" ADD COLUMN "vehicleGenerationId" TEXT;

-- 4. Fill vehicleGenerationId by matching through the old vehicleModelId
UPDATE "ProductCompatibility" pc
SET "vehicleGenerationId" = vg."id"
FROM "VehicleGeneration" vg
WHERE vg."modelId" = pc."vehicleModelId";

-- 5. Make it NOT NULL
ALTER TABLE "ProductCompatibility" ALTER COLUMN "vehicleGenerationId" SET NOT NULL;

-- 6. Now deduplicate VehicleModel: merge models with same (brandId, name)
-- For each group, keep the one with the lowest yearFrom (the "keeper")
-- Update generations to point to the keeper

-- Create temp table of keepers
CREATE TEMP TABLE model_keepers AS
SELECT DISTINCT ON ("brandId", "name") "id" as keeper_id, "brandId", "name"
FROM "VehicleModel"
ORDER BY "brandId", "name", "yearFrom";

-- Update generations whose modelId is NOT the keeper to point to the keeper
UPDATE "VehicleGeneration" vg
SET "modelId" = mk.keeper_id
FROM "VehicleModel" vm, model_keepers mk
WHERE vg."modelId" = vm."id"
  AND mk."brandId" = vm."brandId"
  AND mk."name" = vm."name"
  AND vm."id" != mk.keeper_id;

-- Update UserVehicle to point to keeper model
UPDATE "UserVehicle" uv
SET "vehicleModelId" = mk.keeper_id
FROM "VehicleModel" vm, model_keepers mk
WHERE uv."vehicleModelId" = vm."id"
  AND mk."brandId" = vm."brandId"
  AND mk."name" = vm."name"
  AND vm."id" != mk.keeper_id;

-- Delete duplicate VehicleModel rows (non-keepers)
DELETE FROM "VehicleModel" vm
WHERE NOT EXISTS (
  SELECT 1 FROM model_keepers mk WHERE mk.keeper_id = vm."id"
);

DROP TABLE model_keepers;

-- 7. Drop old columns and constraints
ALTER TABLE "ProductCompatibility" DROP CONSTRAINT IF EXISTS "ProductCompatibility_productId_vehicleModelId_key";
ALTER TABLE "ProductCompatibility" DROP COLUMN "vehicleModelId";

-- 8. Drop yearFrom/yearTo from VehicleModel
ALTER TABLE "VehicleModel" DROP COLUMN "yearFrom";
ALTER TABLE "VehicleModel" DROP COLUMN "yearTo";

-- 9. Add generationId column to UserVehicle
ALTER TABLE "UserVehicle" ADD COLUMN "generationId" TEXT;

-- 10. Add new constraints and indexes
CREATE UNIQUE INDEX "VehicleModel_brandId_name_key" ON "VehicleModel"("brandId", "name");
CREATE UNIQUE INDEX "ProductCompatibility_productId_vehicleGenerationId_key" ON "ProductCompatibility"("productId", "vehicleGenerationId");
CREATE INDEX "VehicleGeneration_modelId_idx" ON "VehicleGeneration"("modelId");

-- 11. Add foreign keys
ALTER TABLE "VehicleGeneration" ADD CONSTRAINT "VehicleGeneration_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductCompatibility" ADD CONSTRAINT "ProductCompatibility_vehicleGenerationId_fkey" FOREIGN KEY ("vehicleGenerationId") REFERENCES "VehicleGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
