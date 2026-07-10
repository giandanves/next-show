import {Ctx} from "blitz"
import db from "db"
import {isPlatformAdmin} from "src/lib/artistAccess"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function getArtistsForAdmin(_: null, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)

  if (isPlatformAdmin(role)) {
    return db.artist.findMany({
      orderBy: [{displayName: "asc"}, {slug: "asc"}],
      select: {
        id: true,
        slug: true,
        displayName: true,
        ownerUserId: true,
        owner: {select: {email: true}},
      },
    })
  }

  return db.artist.findMany({
    where: {
      OR: [
        {ownerUserId: userId},
        {members: {some: {userId, role: "EDITOR"}}},
      ],
    },
    orderBy: [{displayName: "asc"}, {slug: "asc"}],
    select: {
      id: true,
      slug: true,
      displayName: true,
      ownerUserId: true,
      owner: {select: {email: true}},
    },
  })
}
