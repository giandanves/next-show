import type {Role} from "types"

export const ARTIST_MEMBER_ROLE_EDITOR = "EDITOR"

export type ArtistMemberRecord = {
  userId: number
  role: string
}

export type ArtistAccessInput = {
  userId: number
  userRole: Role
  artist: {
    id: number
    ownerUserId: number
  }
  members?: ArtistMemberRecord[]
}

export function isPlatformAdmin(userRole: Role): boolean {
  return userRole === "ADMIN"
}

export function isPlatformCreatorOrAdmin(userRole: Role): boolean {
  return userRole === "ADMIN" || userRole === "CREATOR"
}

export function canEditArtist(input: ArtistAccessInput): boolean {
  if (isPlatformAdmin(input.userRole)) return true
  if (input.artist.ownerUserId === input.userId) return true
  return (
    input.members?.some(
      (m) => m.userId === input.userId && m.role === ARTIST_MEMBER_ROLE_EDITOR,
    ) ?? false
  )
}

export function canAcceptShowParticipation(input: ArtistAccessInput): boolean {
  return canEditArtist(input)
}
