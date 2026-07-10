import {Ctx} from "blitz"
import db from "db"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function getShowsForArtistAdmin({artistId}: {artistId: number}, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  await assertCanEditArtist(userId, role, artistId)

  const links = await db.showArtist.findMany({
    where: {artistId},
    orderBy: {show: {startsAt: "asc"}},
    select: {
      id: true,
      participationStatus: true,
      show: {
        select: {
          id: true,
          title: true,
          startsAt: true,
          ticketPurchaseUrl: true,
        },
      },
    },
  })

  return links.map((l) => ({
    showArtistId: l.id,
    participationStatus: l.participationStatus,
    ...l.show,
  }))
}
