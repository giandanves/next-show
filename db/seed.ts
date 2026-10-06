import {PrismaClient} from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

/** Dev admin: use this email in the login form (Zod requires a valid email). Password: admin */
const ADMIN_EMAIL = "admin@next-show.local"
const ADMIN_PASSWORD = "admin"

type ArtistSeed = {
  slug: string
  displayName: string
}

const ARTISTS: ArtistSeed[] = [
  {slug: "william-wallacy", displayName: "William Wallacy"},
  {slug: "lazaro-otavio", displayName: "Lázaro Otávio"},
  {slug: "deehsales", displayName: "Deeh Sales"},
  {slug: "giandanves", displayName: "Gian Danves"},
]

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

  const admin = await prisma.user.upsert({
    where: {email: ADMIN_EMAIL},
    update: {role: "ADMIN", hashedPassword, name: "Admin"},
    create: {
      email: ADMIN_EMAIL,
      role: "ADMIN",
      hashedPassword,
      name: "Admin",
    },
  })

  // Temporary demo seed: clear shows/invites/venues/artists owned by this wipe.
  await prisma.showArtistInvite.deleteMany()
  await prisma.showArtist.deleteMany()
  await prisma.show.deleteMany()
  await prisma.artistMember.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.location.deleteMany()

  const artists = {} as Record<string, {id: number; slug: string}>
  for (const a of ARTISTS) {
    const row = await prisma.artist.create({
      data: {
        slug: a.slug,
        displayName: a.displayName,
        ownerUserId: admin.id,
        publicationStatus: "PUBLISHED",
      },
      select: {id: true, slug: true},
    })
    artists[a.slug] = row
  }

  const fluxo084 = await prisma.venue.create({
    data: {
      name: "Fluxo 084",
      slug: "fluxo-084",
      addressLine1: "Ponta Negra",
      city: "Natal",
      region: "RN",
      country: "BR",
      publicationStatus: "PUBLISHED",
      ownerUserId: admin.id,
    },
  })

  const acusticoSp = await prisma.venue.create({
    data: {
      name: "Acústico",
      slug: "acustico-sao-paulo",
      addressLine1: "São Paulo",
      city: "São Paulo",
      region: "SP",
      country: "BR",
      publicationStatus: "PUBLISHED",
      ownerUserId: admin.id,
    },
  })

  const ticketUrl = "https://example.com/tickets"

  async function linkArtists(
    showId: number,
    cast: {slug: string; status?: "ACCEPTED" | "PENDING"; order?: number}[],
  ) {
    const now = new Date()
    for (let i = 0; i < cast.length; i++) {
      const item = cast[i]
      const artist = artists[item.slug]
      const status = item.status ?? "ACCEPTED"
      await prisma.showArtist.create({
        data: {
          showId,
          artistId: artist.id,
          displayOrder: item.order ?? i,
          participationStatus: status,
          acceptedAt: status === "ACCEPTED" ? now : null,
        },
      })
    }
  }

  // Natal / Fluxo 084
  const malandro = await prisma.show.create({
    data: {
      title: "Um malandro e um otário",
      startsAt: new Date("2026-10-10T21:00:00-03:00"),
      ticketPurchaseUrl: ticketUrl,
      venueId: fluxo084.id,
      addressLine1: "Ponta Negra",
      city: "Natal",
      region: "RN",
      country: "BR",
      createdByUserId: admin.id,
    },
  })
  await linkArtists(malandro.id, [
    {slug: "lazaro-otavio"},
    {slug: "deehsales"},
  ])

  const piadas = await prisma.show.create({
    data: {
      title: "Piadas Mágicas",
      startsAt: new Date("2026-10-17T21:00:00-03:00"),
      ticketPurchaseUrl: "https://outgo.com.br/gian-danves-piadas-magicas",
      venueId: fluxo084.id,
      addressLine1: "Ponta Negra",
      city: "Natal",
      region: "RN",
      country: "BR",
      createdByUserId: admin.id,
    },
  })
  await linkArtists(piadas.id, [{slug: "giandanves"}])

  const fabrica = await prisma.show.create({
    data: {
      title: "Fábrica de Paidas",
      startsAt: new Date("2026-11-07T21:00:00-03:00"),
      ticketPurchaseUrl: ticketUrl,
      venueId: fluxo084.id,
      addressLine1: "Ponta Negra",
      city: "Natal",
      region: "RN",
      country: "BR",
      createdByUserId: admin.id,
    },
  })
  await linkArtists(fabrica.id, [
    {slug: "william-wallacy"},
    {slug: "lazaro-otavio"},
    {slug: "deehsales"},
    {slug: "giandanves"},
  ])

  // São Paulo / Acústico — William Wallacy only
  const rgCpf = await prisma.show.create({
    data: {
      title: "RG e CPF",
      startsAt: new Date("2026-10-24T20:00:00-03:00"),
      ticketPurchaseUrl: ticketUrl,
      venueId: acusticoSp.id,
      addressLine1: "São Paulo",
      city: "São Paulo",
      region: "SP",
      country: "BR",
      createdByUserId: admin.id,
    },
  })
  await linkArtists(rgCpf.id, [{slug: "william-wallacy"}])

  console.log("Seed OK (temporary demo):", {
    adminEmail: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    artists: ARTISTS.map((a) => a.slug),
    venues: [fluxo084.slug, acusticoSp.slug],
    shows: [
      {id: malandro.id, title: malandro.title, path: `/shows/${malandro.id}`},
      {id: piadas.id, title: piadas.title, path: `/shows/${piadas.id}`},
      {id: rgCpf.id, title: rgCpf.title, path: `/shows/${rgCpf.id}`},
      {id: fabrica.id, title: fabrica.title, path: `/shows/${fabrica.id}`},
    ],
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
