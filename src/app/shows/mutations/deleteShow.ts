import {Ctx} from "blitz"
import db from "db"
import {z} from "zod"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

const Input = z.object({
  showId: z.number().int().positive(),
  artistId: z.number().int().positive(),
})

export default async function deleteShow(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = Input.parse(input)
  await assertCanEditArtist(userId, role, data.artistId)

  const link = await db.showArtist.findUnique({
    where: {showId_artistId: {showId: data.showId, artistId: data.artistId}},
  })
  if (!link) throw new Error("Show not linked to this artist")

  const otherLinks = await db.showArtist.count({
    where: {showId: data.showId, NOT: {artistId: data.artistId}},
  })

  if (otherLinks === 0) {
    await db.show.delete({where: {id: data.showId}})
  } else {
    await db.showArtist.delete({where: {id: link.id}})
  }

  return {ok: true}
}
