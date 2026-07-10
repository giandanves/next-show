import db from "db"
import type {Role} from "types"
import {canAcceptShowParticipation, canEditArtist, type ArtistAccessInput} from "./artistAccess"

export async function loadArtistAccessInput(
  userId: number,
  userRole: Role,
  artistId: number,
): Promise<ArtistAccessInput | null> {
  const artist = await db.artist.findUnique({
    where: {id: artistId},
    select: {
      id: true,
      ownerUserId: true,
      members: {select: {userId: true, role: true}},
    },
  })
  if (!artist) return null
  return {
    userId,
    userRole,
    artist: {id: artist.id, ownerUserId: artist.ownerUserId},
    members: artist.members,
  }
}

export async function assertCanEditArtist(userId: number, userRole: Role, artistId: number) {
  const input = await loadArtistAccessInput(userId, userRole, artistId)
  if (!input || !canEditArtist(input)) {
    throw new Error("You are not allowed to edit this artist")
  }
  return input
}

export async function assertCanAcceptShowParticipation(
  userId: number,
  userRole: Role,
  artistId: number,
) {
  const input = await loadArtistAccessInput(userId, userRole, artistId)
  if (!input || !canAcceptShowParticipation(input)) {
    throw new Error("You are not allowed to accept participation for this artist")
  }
  return input
}
