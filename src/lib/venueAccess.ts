import type {Role} from "types"
import {isPlatformAdmin} from "./artistAccess"

export type VenueAccessInput = {
  userId: number
  userRole: Role
  venue: {
    id: number
    ownerUserId: number
  }
}

export function canEditVenue(input: VenueAccessInput): boolean {
  if (isPlatformAdmin(input.userRole)) return true
  return input.venue.ownerUserId === input.userId
}

/** ADMIN can hand a venue to a CREATOR (or another ADMIN) so they fully own it. */
export function canTransferVenueOwnership(userRole: Role): boolean {
  return isPlatformAdmin(userRole)
}

export function isEligibleVenueOwner(role: string): boolean {
  return role === "CREATOR" || role === "ADMIN"
}
