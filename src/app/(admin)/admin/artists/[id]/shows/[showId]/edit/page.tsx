"use client"

import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import getShowForAdmin from "src/app/shows/queries/getShowForAdmin"
import {ShowForm} from "../../../../../components/ShowForm"
import styles from "../../../../../admin.module.css"

function EditShow() {
  const params = useParams()
  const artistId = Number(params?.id)
  const showId = Number(params?.showId)
  const enabled = Number.isFinite(artistId) && Number.isFinite(showId)

  const [artist] = useQuery(getArtistForAdmin, {id: artistId}, {enabled})
  const [show] = useQuery(getShowForAdmin, {showId, artistId}, {enabled})

  if (!enabled || !artist || !show) {
    return <p className={styles.error}>Show não encontrado.</p>
  }

  return (
    <>
      <h1 className={styles.h1}>Editar show — {artist.displayName ?? artist.slug}</h1>
      <ShowForm
        artistId={artistId}
        showId={showId}
        mode="edit"
        initial={{
          title: show.title,
          startsAt: new Date(show.startsAt),
          ticketPurchaseUrl: show.ticketPurchaseUrl,
          addressLine1: show.addressLine1 ?? show.location?.addressLine1 ?? null,
          city: show.city ?? show.location?.city ?? null,
          region: show.region ?? show.location?.region ?? null,
        }}
      />
    </>
  )
}

export default function EditArtistShowPage() {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando…</p>}>
      <EditShow />
    </Suspense>
  )
}
