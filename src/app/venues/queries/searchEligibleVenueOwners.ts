import {Ctx} from "blitz"
import db from "db"
import {requireAdmin} from "src/lib/sessionGuards"

/** ADMIN-only: find CREATOR/ADMIN users to transfer venue ownership to. */
export default async function searchEligibleVenueOwners(
  {query}: {query: string},
  ctx: Ctx,
) {
  requireAdmin(ctx)
  const q = query.trim()
  if (q.length < 2) return []

  return db.user.findMany({
    where: {
      role: {in: ["CREATOR", "ADMIN"]},
      OR: [
        {email: {contains: q, mode: "insensitive"}},
        {name: {contains: q, mode: "insensitive"}},
      ],
    },
    orderBy: {email: "asc"},
    take: 8,
    select: {id: true, email: true, name: true, role: true},
  })
}
