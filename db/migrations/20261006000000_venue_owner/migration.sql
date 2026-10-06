-- AlterTable
ALTER TABLE "Venue" ADD COLUMN "ownerUserId" INTEGER;

-- Backfill existing venues: prefer an ADMIN, otherwise the oldest user.
UPDATE "Venue"
SET "ownerUserId" = COALESCE(
  (SELECT id FROM "User" WHERE role = 'ADMIN' ORDER BY id ASC LIMIT 1),
  (SELECT id FROM "User" ORDER BY id ASC LIMIT 1)
)
WHERE "ownerUserId" IS NULL;

-- Fail loudly if venues exist with no users to own them.
ALTER TABLE "Venue" ALTER COLUMN "ownerUserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Venue_ownerUserId_idx" ON "Venue"("ownerUserId");
