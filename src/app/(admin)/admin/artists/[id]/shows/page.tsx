"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import getShowsForArtistAdmin from "src/app/shows/queries/getShowsForArtistAdmin"
import {formatShowDateTime} from "src/lib/showFormatting"
import styles from "../../../admin.module.css"

function ArtistShows() {
  const params = useParams()
  const artistId = Number(params?.id)
  const [artist] = useQuery(getArtistForAdmin, {id: artistId}, {enabled: Number.isFinite(artistId)})
  const [shows] = useQuery(getShowsForArtistAdmin, {artistId}, {enabled: Number.isFinite(artistId)})

  if (!Number.isFinite(artistId) || !artist) {
    return <p className={styles.error}>Artista não encontrado.</p>
  }

  return (
    <>
      <h1 className={styles.h1}>Shows — {artist.displayName ?? artist.slug}</h1>
      <div className={styles.actions}>
        <Link href={`/admin/artists/${artistId}/shows/new`} className={styles.button}>
          Novo show
        </Link>
        <Link href={`/admin/artists/${artistId}/edit`}>Voltar ao artista</Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(shows ?? []).map((s) => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{formatShowDateTime(new Date(s.startsAt))}</td>
              <td>{s.participationStatus}</td>
              <td>
                <Link href={`/admin/artists/${artistId}/shows/${s.id}/edit`}>Editar</Link>
                {" · "}
                <Link href={`/shows/${s.id}`}>Público</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default function ArtistShowsPage() {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando shows…</p>}>
      <ArtistShows />
    </Suspense>
  )
}
