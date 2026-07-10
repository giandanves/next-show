import {Ctx} from "blitz"
import db from "db"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function getShowForAdmin(
  {showId, artistId}: {showId: number; artistId: number},
  ctx: Ctx,
) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  await assertCanEditArtist(userId, role, artistId)

  const link = await db.showArtist.findUnique({
    where: {showId_artistId: {showId, artistId}},
    include: {
      show: {
        include: {location: true},
      },
    },
  })
  if (!link) return null
  return link.show
}
