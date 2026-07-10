import Link from "next/link"
import {notFound} from "next/navigation"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import {invoke} from "src/app/blitz-server"
import {ArtistForm} from "../../../components/ArtistForm"
import styles from "../../../admin.module.css"

export default async function EditArtistPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const artistId = Number(id)
  if (!Number.isFinite(artistId)) notFound()

  const artist = await invoke(getArtistForAdmin, {id: artistId})
  if (!artist) notFound()

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
