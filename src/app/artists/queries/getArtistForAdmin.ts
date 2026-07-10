import {Ctx} from "blitz"
import db from "db"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function getArtistForAdmin({id}: {id: number}, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  await assertCanEditArtist(userId, role, id)

  return db.artist.findUnique({
    where: {id},
    select: {
      id: true,
      slug: true,
      displayName: true,
      profilePictureUrl: true,
      socialLinks: true,
    },
  })
}
