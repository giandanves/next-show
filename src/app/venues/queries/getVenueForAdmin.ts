import {Ctx} from "blitz"
import db from "db"
import {assertCanEditVenue} from "src/lib/venueAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function getVenueForAdmin({id}: {id: number}, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  await assertCanEditVenue(userId, role, id)

  return db.venue.findUnique({
    where: {id},
    select: {
      id: true,
      name: true,
      slug: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      region: true,
      postalCode: true,
      country: true,
      publicationStatus: true,
      ownerUserId: true,
      owner: {select: {id: true, email: true, name: true, role: true}},
    },
  })
}
