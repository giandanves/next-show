import {Ctx} from "blitz"
import db from "db"
import {UpdateShow} from "src/app/artists/validations"
import {isPlatformAdmin} from "src/lib/artistAccess"
import {canEditArtist} from "src/lib/artistAccess"
import {loadArtistAccessInput} from "src/lib/artistAccessDb"
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

  return db.show.update({
    where: {id: data.showId},
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
    },
    select: {id: true},
  })
}
