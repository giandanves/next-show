import { PrismaClient } from "@prisma/client"
import { SecurePassword } from "@blitzjs/auth/secure-password"

const prisma = new PrismaClient()

/** Dev admin: use this email in the login form (Zod requires a valid email). Password: admin */
const ADMIN_EMAIL = "admin@next-show.local"
const ADMIN_PASSWORD = "admin"

const ARTIST_SLUG = "giandanves"

async function main() {
  const hashedPassword = await SecurePassword.hash(ADMIN_PASSWORD)

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", hashedPassword },
    create: {
      email: ADMIN_EMAIL,
      role: "ADMIN",
      hashedPassword,
      name: "Admin",
    },
  })

  const artist = await prisma.artist.upsert({
    where: { slug: ARTIST_SLUG },
    update: { ownerUserId: admin.id, displayName: "giandanves" },
    create: {
      slug: ARTIST_SLUG,
      displayName: "giandanves",
      ownerUserId: admin.id,
    },
  })

  let location = await prisma.location.findFirst({
    where: {
      label: "Teatro Alberto Maranhão",
      postalCode: "59012-380",
    },
  })

  if (!location) {
    location = await prisma.location.create({
      data: {
        label: "Teatro Alberto Maranhão",
        addressLine1: "Praça Augusto Severo, 251",
        addressLine2: "Ribeira",
        city: "Natal",
        region: "RN",
        postalCode: "59012-380",
        country: "BR",
      },
    })
  }

  const startsAt = new Date("2026-05-21T19:30:00-03:00")
  const ticketPurchaseUrl = "https://outgo.com.br/gian-danves-piadas-magicas"

  const existingShow = await prisma.show.findFirst({
    where: {
      title: "Piadas Mágicas",
      createdByUserId: admin.id,
      startsAt,
    },
  })

  if (existingShow) {
    await prisma.showArtist.deleteMany({ where: { showId: existingShow.id } })
    await prisma.show.delete({ where: { id: existingShow.id } })
  }

  const show = await prisma.show.create({
    data: {
      title: "Piadas Mágicas",
      startsAt,
      ticketPurchaseUrl,
      locationId: location.id,
      venueId: null,
      createdByUserId: admin.id,
    },
  })

  await prisma.showArtist.upsert({
    where: {
      showId_artistId: { showId: show.id, artistId: artist.id },
    },
    update: { displayOrder: 0, billingRole: "HEADLINE" },
    create: {
      showId: show.id,
      artistId: artist.id,
      displayOrder: 0,
      billingRole: "HEADLINE",
    },
  })

  console.log("Seed OK:", { adminEmail: ADMIN_EMAIL, artistSlug: ARTIST_SLUG, showId: show.id })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
