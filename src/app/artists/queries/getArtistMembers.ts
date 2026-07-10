import {Ctx} from "blitz"
import db from "db"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function getArtistMembers({artistId}: {artistId: number}, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  await assertCanEditArtist(userId, role, artistId)

  return db.artistMember.findMany({
    where: {artistId},
    orderBy: {createdAt: "asc"},
    select: {
      id: true,
      role: true,
      user: {select: {id: true, email: true, name: true}},
    },
  })
}
