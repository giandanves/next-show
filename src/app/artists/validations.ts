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

/** Geocoder place reference picked from address suggestions, e.g. "W1228726668". */
export const PlaceRef = z
  .string()
  .regex(/^[NWR]\d+$/, "Pick an address from the suggestions")

/** Applied only when the picked place is a street without a mapped number. */
export const HouseNumber = z
  .string()
  .trim()
  .regex(/^\d{1,6}[A-Za-z]?$/, "House number must be digits, optionally followed by a letter")

export const CreateShow = z.object({
  artistId: z.number().int().positive(),
  title: z.string().min(1).max(200),
  startsAt: z.string().min(1),
  ticketPurchaseUrl: z.string().url(),
  placeRef: PlaceRef,
  houseNumber: HouseNumber.optional(),
})

export const UpdateShow = CreateShow.extend({
  showId: z.number().int().positive(),
  /** Omit to keep the current address. */
  placeRef: PlaceRef.optional(),
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
  placeRef: PlaceRef,
  houseNumber: HouseNumber.optional(),
})

export const UpdateVenue = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  slug: ArtistSlug,
  /** Omit to keep the current address. */
  placeRef: PlaceRef.optional(),
  houseNumber: HouseNumber.optional(),
})

/** ADMIN hands full venue ownership to a CREATOR (or another ADMIN). */
export const TransferVenueOwnership = z.object({
  venueId: z.number().int().positive(),
  newOwnerUserId: z.number().int().positive(),
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
