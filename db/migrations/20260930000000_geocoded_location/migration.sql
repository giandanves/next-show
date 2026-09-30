-- AlterTable
ALTER TABLE "Location" ADD COLUMN "formattedAddress" TEXT,
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION,
ADD COLUMN "geoProvider" TEXT,
ADD COLUMN "geoPlaceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Location_geoProvider_geoPlaceId_key" ON "Location"("geoProvider", "geoPlaceId");
