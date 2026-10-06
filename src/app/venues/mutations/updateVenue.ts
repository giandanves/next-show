import {Ctx} from "blitz"
import db from "db"
import {UpdateVenue} from "src/app/artists/validations"
import {resolveStructuredAddress} from "src/lib/geo/locationDb"
import {assertCanEditVenue} from "src/lib/venueAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function updateVenue(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = UpdateVenue.parse(input)
  await assertCanEditVenue(userId, role, data.id)

  const address = data.placeRef
    ? await resolveStructuredAddress(data.placeRef, data.houseNumber)
    : null

  try {
    return await db.venue.update({
      where: {id: data.id},
      data: {
        name: data.name,
        slug: data.slug,
        ...(address
          ? {
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              region: address.region,
              postalCode: address.postalCode,
              country: address.country,
            }
          : {}),
      },
      select: {id: true, slug: true},
    })
  } catch (err: any) {
    if (err?.code === "P2002") throw new Error("This venue slug is already taken")
    throw err
  }
}
