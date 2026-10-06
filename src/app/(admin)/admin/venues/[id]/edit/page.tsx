"use client"

import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import getVenueForAdmin from "src/app/venues/queries/getVenueForAdmin"
import {isPlatformAdmin} from "src/lib/artistAccess"
import {formatShowAddress} from "src/lib/showFormatting"
import type {Role} from "types"
import {TransferVenueOwnership} from "../../../components/TransferVenueOwnership"
import {VenueForm} from "../../../components/VenueForm"
import styles from "../../../admin.module.css"

function EditVenue() {
  const params = useParams()
  const venueId = Number(params?.id)
  const user = useCurrentUser()
  const [venue, {refetch}] = useQuery(
    getVenueForAdmin,
    {id: venueId},
    {enabled: Number.isFinite(venueId)},
  )

  if (!Number.isFinite(venueId) || !venue) {
    return <p className={styles.error}>Venue não encontrada.</p>
  }

  const addressLabel =
    formatShowAddress({
      addressLine1: venue.addressLine1,
      addressLine2: venue.addressLine2,
      city: venue.city,
      region: venue.region,
      postalCode: venue.postalCode,
      country: venue.country,
      location: null,
    }) || null

  const isAdmin = user && isPlatformAdmin(user.role as Role)

  return (
    <>
      <h1 className={styles.h1}>Editar venue</h1>
      <p className={styles.hint}>
        Status: {venue.publicationStatus} · Owner:{" "}
        {venue.owner.name ? `${venue.owner.name} (${venue.owner.email})` : venue.owner.email}
      </p>
      <VenueForm
        mode="edit"
        initial={{
          id: venue.id,
          name: venue.name,
          slug: venue.slug,
          addressLabel,
        }}
      />
      {isAdmin && (
        <TransferVenueOwnership
          venueId={venue.id}
          currentOwnerUserId={venue.ownerUserId}
          onTransferred={() => refetch()}
        />
      )}
    </>
  )
}

export default function EditVenuePage() {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando…</p>}>
      <EditVenue />
    </Suspense>
  )
}
