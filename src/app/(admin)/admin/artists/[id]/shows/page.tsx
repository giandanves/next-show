"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import getShowsForArtistAdmin from "src/app/shows/queries/getShowsForArtistAdmin"
import {formatShowDateTime} from "src/lib/showFormatting"
import {ui} from "../../../ui"

function ArtistShows() {
  const params = useParams()
  const artistId = Number(params?.id)
  const [artist] = useQuery(getArtistForAdmin, {id: artistId}, {enabled: Number.isFinite(artistId)})
  const [shows] = useQuery(getShowsForArtistAdmin, {artistId}, {enabled: Number.isFinite(artistId)})

  if (!Number.isFinite(artistId) || !artist) {
    return <p className={ui.error}>Artista não encontrado.</p>
  }

  return (
    <>
      <h1 className={ui.h1}>Shows — {artist.displayName ?? artist.slug}</h1>
      <div className={ui.actions}>
        <Link href={`/admin/artists/${artistId}/shows/new`} className={ui.button}>
          Novo show
        </Link>
        <Link href={`/admin/artists/${artistId}/edit`}>Voltar ao artista</Link>
      </div>
      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Título</th>
            <th className={ui.th}>Data</th>
            <th className={ui.th}>Status</th>
            <th className={ui.th} />
          </tr>
        </thead>
        <tbody>
          {(shows ?? []).map((s) => (
            <tr key={s.id}>
              <td className={ui.td}>{s.title}</td>
              <td className={ui.td}>{formatShowDateTime(new Date(s.startsAt))}</td>
              <td className={ui.td}>{s.participationStatus}</td>
              <td className={ui.td}>
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
    <Suspense fallback={<p className={ui.hint}>Carregando shows…</p>}>
      <ArtistShows />
    </Suspense>
  )
}
