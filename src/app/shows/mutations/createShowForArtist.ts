import {Ctx} from "blitz"
import db from "db"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"
import {CreateShow} from "src/app/artists/validations"

export default async function createShowForArtist(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = CreateShow.parse(input)
  await assertCanEditArtist(userId, role, data.artistId)

  const startsAt = new Date(data.startsAt)
  if (Number.isNaN(startsAt.getTime())) throw new Error("Invalid startsAt date")

  const now = new Date()
  const show = await db.show.create({
    data: {
      title: data.title,
      startsAt,
      ticketPurchaseUrl: data.ticketPurchaseUrl,
      locationId: data.locationId ?? null,
      addressLine1: data.addressLine1 || null,
      addressLine2: data.addressLine2 || null,
      city: data.city || null,
      region: data.region || null,
      postalCode: data.postalCode || null,
      country: data.country || null,
      createdByUserId: userId,
    },
  })

  await db.showArtist.create({
    data: {
      showId: show.id,
      artistId: data.artistId,
      participationStatus: "ACCEPTED",
      acceptedAt: now,
    },
  })

  return {id: show.id}
}
