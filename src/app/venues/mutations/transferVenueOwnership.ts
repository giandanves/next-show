import {Ctx} from "blitz"
import db from "db"
import {TransferVenueOwnership} from "src/app/artists/validations"
import {requireAdmin} from "src/lib/sessionGuards"
import {canTransferVenueOwnership, isEligibleVenueOwner} from "src/lib/venueAccess"

/** ADMIN-only: give full venue ownership to a CREATOR (or another ADMIN). */
export default async function transferVenueOwnership(input: unknown, ctx: Ctx) {
  const {role} = requireAdmin(ctx)
  if (!canTransferVenueOwnership(role)) throw new Error("Only ADMIN can transfer venue ownership")

  const data = TransferVenueOwnership.parse(input)

  const [venue, newOwner] = await Promise.all([
    db.venue.findUnique({where: {id: data.venueId}, select: {id: true, ownerUserId: true}}),
    db.user.findUnique({
      where: {id: data.newOwnerUserId},
      select: {id: true, role: true, email: true},
    }),
  ])

  if (!venue) throw new Error("Venue not found")
  if (!newOwner) throw new Error("User not found")
  if (!isEligibleVenueOwner(newOwner.role)) {
    throw new Error("New owner must be a CREATOR or ADMIN")
  }
  if (venue.ownerUserId === newOwner.id) {
    throw new Error("That user already owns this venue")
  }

  return db.venue.update({
    where: {id: venue.id},
    data: {ownerUserId: newOwner.id},
    select: {
      id: true,
      ownerUserId: true,
      owner: {select: {id: true, email: true, name: true, role: true}},
    },
  })
}
