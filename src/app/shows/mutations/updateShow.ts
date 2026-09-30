import {Ctx} from "blitz"
import db from "db"
import {UpdateShow} from "src/app/artists/validations"
import {isPlatformAdmin} from "src/lib/artistAccess"
import {canEditArtist} from "src/lib/artistAccess"
import {loadArtistAccessInput} from "src/lib/artistAccessDb"
import {resolveLocationId} from "src/lib/geo/locationDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function updateShow(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = UpdateShow.parse(input)

  if (!isPlatformAdmin(role)) {
    const links = await db.showArtist.findMany({
      where: {showId: data.showId},
      select: {artistId: true},
    })
    let allowed = false
    for (const link of links) {
      const access = await loadArtistAccessInput(userId, role, link.artistId)
      if (access && canEditArtist(access)) {
        allowed = true
        break
      }
    }
    if (!allowed) throw new Error("You are not allowed to edit this show")
  }

  const startsAt = new Date(data.startsAt)
  if (Number.isNaN(startsAt.getTime())) throw new Error("Invalid startsAt date")

  // Legacy free-text address fields are cleared once a validated Location is set.
  const addressData = data.placeRef
    ? {
        locationId: await resolveLocationId(data.placeRef, data.houseNumber),
        addressLine1: null,
        addressLine2: null,
        city: null,
        region: null,
        postalCode: null,
        country: null,
      }
    : {}

  return db.show.update({
    where: {id: data.showId},
    data: {
      title: data.title,
      startsAt,
      ticketPurchaseUrl: data.ticketPurchaseUrl,
      ...addressData,
    },
    select: {id: true},
  })
}
