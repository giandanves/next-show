"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import {ArtistForm} from "../../../components/ArtistForm"
import styles from "../../../admin.module.css"

function EditArtist() {
  const params = useParams()
  const artistId = Number(params?.id)
  const [artist] = useQuery(getArtistForAdmin, {id: artistId}, {enabled: Number.isFinite(artistId)})

  if (!Number.isFinite(artistId) || !artist) {
    return <p className={styles.error}>Artista não encontrado.</p>
  }

  return (
    <>
      <h1 className={styles.h1}>Editar artista</h1>
      <div className={styles.actions}>
        <Link href={`/admin/artists/${artistId}/shows`}>Shows</Link>
        <Link href={`/admin/artists/${artistId}/members`}>Membros</Link>
        <Link href={`/${artist.slug}`}>Ver página pública</Link>
      </div>
      <ArtistForm mode="edit" initial={artist} />
    </>
  )
}

export default function EditArtistPage() {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando…</p>}>
      <EditArtist />
    </Suspense>
  )
}
