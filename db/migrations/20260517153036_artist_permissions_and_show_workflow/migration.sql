/*
  Warnings:

  - Added the required column `name` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ArtistMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL,
    "artistId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ArtistMember_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtistMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShowArtistInvite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "consumedAt" DATETIME,
    "showArtistId" INTEGER NOT NULL,
    "invitedByUserId" INTEGER NOT NULL,
    CONSTRAINT "ShowArtistInvite_showArtistId_fkey" FOREIGN KEY ("showArtistId") REFERENCES "ShowArtist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShowArtistInvite_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShowArtist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "participationStatus" TEXT NOT NULL DEFAULT 'ACCEPTED',
    "acceptedAt" DATETIME,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "billingRole" TEXT,
    "showId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    CONSTRAINT "ShowArtist_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShowArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ShowArtist" ("artistId", "billingRole", "createdAt", "displayOrder", "id", "showId", "updatedAt") SELECT "artistId", "billingRole", "createdAt", "displayOrder", "id", "showId", "updatedAt" FROM "ShowArtist";
DROP TABLE "ShowArtist";
ALTER TABLE "new_ShowArtist" RENAME TO "ShowArtist";
CREATE INDEX "ShowArtist_participationStatus_idx" ON "ShowArtist"("participationStatus");
CREATE UNIQUE INDEX "ShowArtist_showId_artistId_key" ON "ShowArtist"("showId", "artistId");
CREATE TABLE "new_Venue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "region" TEXT,
    "postalCode" TEXT,
    "country" TEXT
);
INSERT INTO "new_Venue" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Venue";
DROP TABLE "Venue";
ALTER TABLE "new_Venue" RENAME TO "Venue";
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ArtistMember_artistId_userId_key" ON "ArtistMember"("artistId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowArtistInvite_tokenHash_key" ON "ShowArtistInvite"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "ShowArtistInvite_showArtistId_key" ON "ShowArtistInvite"("showArtistId");
