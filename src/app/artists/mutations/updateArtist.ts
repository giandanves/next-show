import {Ctx} from "blitz"
import db from "db"
import {UpdateArtist} from "../validations"
import {assertCanEditArtist} from "src/lib/artistAccessDb"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function updateArtist(input: unknown, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)
  const data = UpdateArtist.parse(input)
  await assertCanEditArtist(userId, role, data.id)

  return db.artist.update({
    where: {id: data.id},
    data: {
      slug: data.slug,
      displayName: data.displayName,
      profilePictureUrl: data.profilePictureUrl || null,
      socialLinks: data.socialLinks?.trim() || null,
    },
    select: {id: true, slug: true},
  })
}
