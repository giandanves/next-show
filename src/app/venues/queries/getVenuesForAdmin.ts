import {Ctx} from "blitz"
import db from "db"
import {isPlatformAdmin} from "src/lib/artistAccess"
import {requireCreatorOrAdmin} from "src/lib/sessionGuards"

export default async function getVenuesForAdmin(_: null, ctx: Ctx) {
  const {userId, role} = requireCreatorOrAdmin(ctx)

  return db.venue.findMany({
    where: isPlatformAdmin(role) ? undefined : {ownerUserId: userId},
    orderBy: [{name: "asc"}, {slug: "asc"}],
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      region: true,
      publicationStatus: true,
      ownerUserId: true,
      owner: {select: {email: true, name: true}},
    },
  })
}
