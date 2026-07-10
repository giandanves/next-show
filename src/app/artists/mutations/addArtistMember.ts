import {Ctx} from "blitz"
import db from "db"
import {ARTIST_MEMBER_ROLE_EDITOR} from "src/lib/artistAccess"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"
import {AddArtistMember} from "../validations"

export default async function addArtistMember(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = AddArtistMember.parse(input)
  await assertCanEditArtist(userId, role, data.artistId)

  const artist = await db.artist.findUnique({
    where: {id: data.artistId},
    select: {ownerUserId: true},
  })
  if (!artist) throw new Error("Artist not found")

  const targetUser = await db.user.findUnique({
    where: {email: data.email.toLowerCase()},
    select: {id: true, email: true},
  })
  if (!targetUser) throw new Error("User not found with this email")
  if (targetUser.id === artist.ownerUserId) {
    throw new Error("Owner already has full access")
  }

  return db.artistMember.upsert({
    where: {
      artistId_userId: {artistId: data.artistId, userId: targetUser.id},
    },
    update: {role: ARTIST_MEMBER_ROLE_EDITOR},
    create: {
      artistId: data.artistId,
      userId: targetUser.id,
      role: ARTIST_MEMBER_ROLE_EDITOR,
    },
    select: {
      id: true,
      user: {select: {email: true}},
      role: true,
    },
  })
}
