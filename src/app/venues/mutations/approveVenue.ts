import {Ctx} from "blitz"
import db from "db"
import {z} from "zod"
import {PUBLICATION_STATUS_PUBLISHED} from "src/lib/publicationStatus"
import {requireAdmin} from "src/lib/sessionGuards"

const ApproveVenue = z.object({
  id: z.number().int().positive(),
})

/** ADMIN-only: make a venue publicly visible (for when venue CRUD lands). */
export default async function approveVenue(input: unknown, ctx: Ctx) {
  requireAdmin(ctx)
  const {id} = ApproveVenue.parse(input)

  return db.venue.update({
    where: {id},
    data: {publicationStatus: PUBLICATION_STATUS_PUBLISHED},
    select: {id: true, slug: true, publicationStatus: true},
  })
}
