import db from "db"

/** Server-only read for public show/event pages (no Blitz invoke / RPC bundle). */
export async function fetchShowById(showId: number) {
  if (!Number.isFinite(showId) || showId <= 0) return null

  return db.show.findUnique({
    where: {id: showId},
    select: {
      id: true,
      title: true,
      startsAt: true,
      ticketPurchaseUrl: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      region: true,
      postalCode: true,
      country: true,
      location: {
        select: {
          label: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          region: true,
          postalCode: true,
          country: true,
        },
      },
      venue: {
        select: {
          name: true,
          slug: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          region: true,
          postalCode: true,
          country: true,
          publicationStatus: true,
        },
      },
      artistLinks: {
        orderBy: [{displayOrder: "asc"}, {id: "asc"}],
        select: {
          participationStatus: true,
          displayOrder: true,
          artist: {
            select: {
              slug: true,
              displayName: true,
              publicationStatus: true,
            },
          },
        },
      },
    },
  })
}
