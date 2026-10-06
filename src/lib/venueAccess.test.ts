import {describe, expect, it} from "vitest"
import {
  canEditVenue,
  canTransferVenueOwnership,
  isEligibleVenueOwner,
} from "./venueAccess"

const venue = {id: 1, ownerUserId: 10}

describe("venueAccess", () => {
  it("allows admin to edit any venue", () => {
    expect(canEditVenue({userId: 99, userRole: "ADMIN", venue})).toBe(true)
  })

  it("allows owner to edit", () => {
    expect(canEditVenue({userId: 10, userRole: "CREATOR", venue})).toBe(true)
  })

  it("denies unrelated creator", () => {
    expect(canEditVenue({userId: 20, userRole: "CREATOR", venue})).toBe(false)
  })

  it("only admins can transfer ownership", () => {
    expect(canTransferVenueOwnership("ADMIN")).toBe(true)
    expect(canTransferVenueOwnership("CREATOR")).toBe(false)
  })

  it("accepts CREATOR or ADMIN as new owners", () => {
    expect(isEligibleVenueOwner("CREATOR")).toBe(true)
    expect(isEligibleVenueOwner("ADMIN")).toBe(true)
    expect(isEligibleVenueOwner("USER")).toBe(false)
  })
})
