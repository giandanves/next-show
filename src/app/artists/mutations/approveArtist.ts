import {Ctx} from "blitz"
import db from "db"
import {z} from "zod"
import {PUBLICATION_STATUS_PUBLISHED} from "src/lib/publicationStatus"
import {requireAdmin} from "src/lib/sessionGuards"

const ApproveArtist = z.object({
  id: z.number().int().positive(),
})

/** ADMIN-only: make an artist publicly visible. */
export default async function approveArtist(input: unknown, ctx: Ctx) {
  requireAdmin(ctx)
  const {id} = ApproveArtist.parse(input)

  return db.artist.update({
    where: {id},
    data: {publicationStatus: PUBLICATION_STATUS_PUBLISHED},
    select: {id: true, slug: true, publicationStatus: true},
  })
}
