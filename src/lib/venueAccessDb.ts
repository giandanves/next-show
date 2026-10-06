import db from "db"
import type {Role} from "types"
import {canEditVenue, type VenueAccessInput} from "./venueAccess"

export async function loadVenueAccessInput(
  userId: number,
  userRole: Role,
  venueId: number,
): Promise<VenueAccessInput | null> {
  const venue = await db.venue.findUnique({
    where: {id: venueId},
    select: {id: true, ownerUserId: true},
  })
  if (!venue) return null
  return {
    userId,
    userRole,
    venue: {id: venue.id, ownerUserId: venue.ownerUserId},
  }
}

export async function assertCanEditVenue(userId: number, userRole: Role, venueId: number) {
  const input = await loadVenueAccessInput(userId, userRole, venueId)
  if (!input || !canEditVenue(input)) {
    throw new Error("You are not allowed to edit this venue")
  }
  return input
}
