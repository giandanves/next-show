import Link from "next/link"
import {notFound} from "next/navigation"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import getShowsForArtistAdmin from "src/app/shows/queries/getShowsForArtistAdmin"
import {invoke} from "src/app/blitz-server"
import {formatShowDateTime} from "src/lib/showFormatting"
import styles from "../../../admin.module.css"

export default async function ArtistShowsPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const artistId = Number(id)
  if (!Number.isFinite(artistId)) notFound()

  const artist = await invoke(getArtistForAdmin, {id: artistId})
  if (!artist) notFound()

  const shows = await invoke(getShowsForArtistAdmin, {artistId})

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
          {shows.map((s) => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{formatShowDateTime(s.startsAt)}</td>
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
