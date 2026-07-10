import db from "db"

/** Server-only read for public artist pages (no Blitz invoke / RPC bundle). */
export async function fetchArtistBySlug(slug: string) {
  return db.artist.findUnique({
    where: {slug},
    select: {
      slug: true,
      displayName: true,
      profilePictureUrl: true,
      socialLinks: true,
      showLinks: {
        where: {participationStatus: "ACCEPTED"},
        orderBy: {show: {startsAt: "asc"}},
        select: {
          show: {
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
            },
          },
        },
      },
    },
  })
}
