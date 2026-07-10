import {notFound} from "next/navigation"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import {invoke} from "src/app/blitz-server"
import {ShowForm} from "../../../../components/ShowForm"
import styles from "../../../../admin.module.css"

export default async function NewArtistShowPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const artistId = Number(id)
  if (!Number.isFinite(artistId)) notFound()

  const artist = await invoke(getArtistForAdmin, {id: artistId})
  if (!artist) notFound()

  return (
    <>
      <h1 className={styles.h1}>Novo show — {artist.displayName ?? artist.slug}</h1>
      <ShowForm artistId={artistId} mode="create" />
    </>
  )
}
