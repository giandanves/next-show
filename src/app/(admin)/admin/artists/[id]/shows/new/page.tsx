"use client"

import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import {ShowForm} from "../../../../components/ShowForm"
import styles from "../../../../admin.module.css"

function NewShow() {
  const params = useParams()
  const artistId = Number(params?.id)
  const [artist] = useQuery(getArtistForAdmin, {id: artistId}, {enabled: Number.isFinite(artistId)})

  if (!Number.isFinite(artistId) || !artist) {
    return <p className={styles.error}>Artista não encontrado.</p>
  }

  return (
    <>
      <h1 className={styles.h1}>Novo show — {artist.displayName ?? artist.slug}</h1>
      <ShowForm artistId={artistId} mode="create" />
    </>
  )
}

export default function NewArtistShowPage() {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando…</p>}>
      <NewShow />
    </Suspense>
  )
}
