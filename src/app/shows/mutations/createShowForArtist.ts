import {Ctx} from "blitz"
import db from "db"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {resolveLocationId} from "src/lib/geo/locationDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"
import {CreateShow} from "src/app/artists/validations"

export default async function createShowForArtist(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = CreateShow.parse(input)
  await assertCanEditArtist(userId, role, data.artistId)

  const startsAt = new Date(data.startsAt)
  if (Number.isNaN(startsAt.getTime())) throw new Error("Invalid startsAt date")

  const locationId = await resolveLocationId(data.placeRef, data.houseNumber)

  const now = new Date()
  const show = await db.show.create({
    data: {
      title: data.title,
      startsAt,
      ticketPurchaseUrl: data.ticketPurchaseUrl,
      locationId,
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
