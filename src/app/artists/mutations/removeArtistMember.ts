import {Ctx} from "blitz"
import db from "db"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"
import {RemoveArtistMember} from "../validations"

export default async function removeArtistMember(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = RemoveArtistMember.parse(input)
  await assertCanEditArtist(userId, role, data.artistId)

  const member = await db.artistMember.findFirst({
    where: {id: data.memberId, artistId: data.artistId},
  })
  if (!member) throw new Error("Member not found")

  await db.artistMember.delete({where: {id: member.id}})
  return {ok: true}
}
