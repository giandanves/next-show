import {describe, expect, it} from "vitest"
import {
  ARTIST_MEMBER_ROLE_EDITOR,
  canAcceptShowParticipation,
  canEditArtist,
  isPlatformAdmin,
  isPlatformCreatorOrAdmin,
} from "./artistAccess"

const artist = {id: 1, ownerUserId: 10}

describe("artistAccess", () => {
  it("detects platform admin", () => {
    expect(isPlatformAdmin("ADMIN")).toBe(true)
    expect(isPlatformAdmin("CREATOR")).toBe(false)
  })

  it("detects creator or admin for admin area", () => {
    expect(isPlatformCreatorOrAdmin("ADMIN")).toBe(true)
    expect(isPlatformCreatorOrAdmin("CREATOR")).toBe(true)
    expect(isPlatformCreatorOrAdmin("USER")).toBe(false)
  })

  it("allows admin to edit any artist", () => {
    expect(canEditArtist({userId: 99, userRole: "ADMIN", artist})).toBe(true)
  })

  it("allows owner to edit", () => {
    expect(canEditArtist({userId: 10, userRole: "CREATOR", artist})).toBe(true)
  })

  it("allows editor member to edit", () => {
    expect(
      canEditArtist({
        userId: 20,
        userRole: "USER",
        artist,
        members: [{userId: 20, role: ARTIST_MEMBER_ROLE_EDITOR}],
      }),
    ).toBe(true)
  })

  it("denies unrelated user", () => {
    expect(canEditArtist({userId: 20, userRole: "USER", artist, members: []})).toBe(false)
  })

  it("accept participation matches edit permission", () => {
    expect(canAcceptShowParticipation({userId: 10, userRole: "CREATOR", artist})).toBe(true)
    expect(canAcceptShowParticipation({userId: 20, userRole: "USER", artist})).toBe(false)
  })
})
