/*
  Warnings:

  - Added the required column `ticketPurchaseUrl` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Show" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT,
    "startsAt" DATETIME NOT NULL,
    "ticketPurchaseUrl" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "region" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "locationId" INTEGER,
    "venueId" INTEGER,
    "createdByUserId" INTEGER NOT NULL,
    CONSTRAINT "Show_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Show_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Show_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Show" ("addressLine1", "addressLine2", "city", "country", "createdAt", "createdByUserId", "id", "locationId", "postalCode", "region", "startsAt", "title", "updatedAt", "venueId") SELECT "addressLine1", "addressLine2", "city", "country", "createdAt", "createdByUserId", "id", "locationId", "postalCode", "region", "startsAt", "title", "updatedAt", "venueId" FROM "Show";
DROP TABLE "Show";
ALTER TABLE "new_Show" RENAME TO "Show";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
