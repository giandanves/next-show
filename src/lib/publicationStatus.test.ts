import {describe, expect, it} from "vitest"
import {
  initialPublicationStatus,
  isPublished,
  PUBLICATION_STATUS_PENDING,
  PUBLICATION_STATUS_PUBLISHED,
} from "./publicationStatus"

describe("publicationStatus", () => {
  it("ADMIN creates as PUBLISHED", () => {
    expect(initialPublicationStatus("ADMIN")).toBe(PUBLICATION_STATUS_PUBLISHED)
  })

  it("CREATOR creates as PENDING", () => {
    expect(initialPublicationStatus("CREATOR")).toBe(PUBLICATION_STATUS_PENDING)
  })

  it("detects published status", () => {
    expect(isPublished(PUBLICATION_STATUS_PUBLISHED)).toBe(true)
    expect(isPublished(PUBLICATION_STATUS_PENDING)).toBe(false)
  })
})
