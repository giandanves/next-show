import {Ctx} from "blitz"
import db from "db"

export default async function getArtistBySlug({slug}: {slug: string}, _ctx: Ctx) {
  return db.artist.findUnique({
    where: {slug},
    select: {
      slug: true,
      displayName: true,
      profilePictureUrl: true,
      socialLinks: true,
      showLinks: {
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
