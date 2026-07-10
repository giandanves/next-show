import {Ctx} from "blitz"
import db from "db"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function searchArtists({q}: {q?: string}, ctx: Ctx) {
  requireCreatorOrAdmin(ctx)
  const term = q?.trim()

  return db.artist.findMany({
    where: term
      ? {
          OR: [
            {displayName: {contains: term}},
            {slug: {contains: term}},
          ],
        }
      : undefined,
    orderBy: [{displayName: "asc"}, {slug: "asc"}],
    take: 50,
    select: {
      id: true,
      slug: true,
      displayName: true,
    },
  })
}
