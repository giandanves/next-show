"use client"

import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import {ShowForm} from "../../../../components/ShowForm"
import {ui} from "../../../../ui"

function NewShow() {
  const params = useParams()
  const artistId = Number(params?.id)
  const [artist] = useQuery(getArtistForAdmin, {id: artistId}, {enabled: Number.isFinite(artistId)})

  if (!Number.isFinite(artistId) || !artist) {
    return <p className={ui.error}>Artista não encontrado.</p>
  }

  return (
    <>
      <h1 className={ui.h1}>Novo show — {artist.displayName ?? artist.slug}</h1>
      <ShowForm artistId={artistId} mode="create" />
    </>
  )
}

export default function NewArtistShowPage() {
  return (
    <Suspense fallback={<p className={ui.hint}>Carregando…</p>}>
      <NewShow />
    </Suspense>
  )
}
