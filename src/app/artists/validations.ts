import {z} from "zod"
import {isValidSlug} from "src/lib/slug"

export const ArtistSlug = z
  .string()
  .min(2)
  .max(64)
  .refine(isValidSlug, "Slug must be lowercase letters, numbers, and hyphens only")

export const CreateArtist = z.object({
  slug: ArtistSlug,
  displayName: z.string().min(1).max(120),
  profilePictureUrl: z.string().url().optional().or(z.literal("")),
  socialLinks: z.string().optional(),
})

export const UpdateArtist = CreateArtist.extend({
  id: z.number().int().positive(),
})

export const CreateShow = z.object({
  artistId: z.number().int().positive(),
  title: z.string().min(1).max(200),
  startsAt: z.string().min(1),
  ticketPurchaseUrl: z.string().url(),
  locationId: z.number().int().positive().optional().nullable(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

export const UpdateShow = CreateShow.extend({
  showId: z.number().int().positive(),
}).omit({artistId: true})

export const AddArtistMember = z.object({
  artistId: z.number().int().positive(),
  email: z.string().email(),
})

export const RemoveArtistMember = z.object({
  artistId: z.number().int().positive(),
  memberId: z.number().int().positive(),
})

export const CreateVenue = z.object({
  name: z.string().min(1).max(200),
  slug: ArtistSlug,
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

export const UpdateVenue = CreateVenue.extend({
  id: z.number().int().positive(),
})

export const CreateVenueShow = z.object({
  venueId: z.number().int().positive(),
  title: z.string().min(1).max(200),
  startsAt: z.string().min(1),
  ticketPurchaseUrl: z.string().url(),
  artistIds: z.array(z.number().int().positive()).min(1),
})

export const AssignArtistToShow = z.object({
  showId: z.number().int().positive(),
  artistId: z.number().int().positive(),
})

export const AcceptShowParticipation = z.object({
  token: z.string().min(1),
})

export const DeclineShowParticipation = z.object({
  token: z.string().min(1),
})
