import {Ctx} from "blitz"
import db from "db"
import {PUBLICATION_STATUS_PENDING} from "src/lib/publicationStatus"
import {requireAdmin} from "src/lib/sessionGuards"

/** ADMIN-only list of artists and venues awaiting publication. */
export default async function getPendingApprovals(_: null, ctx: Ctx) {
  requireAdmin(ctx)

  const [artists, venues] = await Promise.all([
    db.artist.findMany({
      where: {publicationStatus: PUBLICATION_STATUS_PENDING},
      orderBy: [{createdAt: "asc"}],
      select: {
        id: true,
        slug: true,
        displayName: true,
        createdAt: true,
        owner: {select: {email: true, name: true}},
      },
    }),
    db.venue.findMany({
      where: {publicationStatus: PUBLICATION_STATUS_PENDING},
      orderBy: [{createdAt: "asc"}],
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
        city: true,
        owner: {select: {email: true, name: true}},
      },
    }),
  ])

  return {artists, venues}
}
