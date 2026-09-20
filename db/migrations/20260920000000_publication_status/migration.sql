-- AlterTable
ALTER TABLE "Artist" ADD COLUMN "publicationStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN "publicationStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- Existing rows were already public; keep them visible.
UPDATE "Artist" SET "publicationStatus" = 'PUBLISHED';
UPDATE "Venue" SET "publicationStatus" = 'PUBLISHED';
