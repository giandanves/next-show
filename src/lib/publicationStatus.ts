/** Publication lifecycle for Artist and Venue (public only when PUBLISHED). */
export const PUBLICATION_STATUS_PENDING = "PENDING"
export const PUBLICATION_STATUS_PUBLISHED = "PUBLISHED"

export type PublicationStatus =
  | typeof PUBLICATION_STATUS_PENDING
  | typeof PUBLICATION_STATUS_PUBLISHED

export function isPublished(status: string | null | undefined): boolean {
  return status === PUBLICATION_STATUS_PUBLISHED
}

/** New records: ADMIN publishes immediately; CREATOR stays pending for review. */
export function initialPublicationStatus(userRole: string): PublicationStatus {
  return userRole === "ADMIN" ? PUBLICATION_STATUS_PUBLISHED : PUBLICATION_STATUS_PENDING
}
