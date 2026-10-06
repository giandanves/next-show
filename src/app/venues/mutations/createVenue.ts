import {Ctx} from "blitz"
import db from "db"
import {CreateVenue} from "src/app/artists/validations"
import {resolveStructuredAddress} from "src/lib/geo/locationDb"
import {initialPublicationStatus} from "src/lib/publicationStatus"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function createVenue(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = CreateVenue.parse(input)
  const address = await resolveStructuredAddress(data.placeRef, data.houseNumber)

  try {
    return await db.venue.create({
      data: {
        name: data.name,
        slug: data.slug,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        country: address.country,
        ownerUserId: userId,
        publicationStatus: initialPublicationStatus(role),
      },
      select: {id: true, slug: true, publicationStatus: true},
    })
  } catch (err: any) {
    if (err?.code === "P2002") throw new Error("This venue slug is already taken")
    throw err
  }
}
