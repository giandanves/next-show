import {Ctx} from "blitz"
import db from "db"
import {CreateArtist} from "../validations"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function createArtist(input: unknown, ctx: Ctx) {
  const {userId} = requireCreatorOrAdmin(ctx)
  const data = CreateArtist.parse(input)

  return db.artist.create({
    data: {
      slug: data.slug,
      displayName: data.displayName,
      profilePictureUrl: data.profilePictureUrl || null,
      socialLinks: data.socialLinks?.trim() || null,
      ownerUserId: userId,
    },
    select: {id: true, slug: true},
  })
}
