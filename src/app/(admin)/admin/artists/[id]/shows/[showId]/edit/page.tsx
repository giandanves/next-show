import {notFound} from "next/navigation"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import getShowForAdmin from "src/app/shows/queries/getShowForAdmin"
import {invoke} from "src/app/blitz-server"
import {ShowForm} from "../../../../../components/ShowForm"
import styles from "../../../../../admin.module.css"

export default async function EditArtistShowPage({
  params,
}: {
  params: Promise<{id: string; showId: string}>
}) {
  const {id, showId: showIdParam} = await params
  const artistId = Number(id)
  const showId = Number(showIdParam)
  if (!Number.isFinite(artistId) || !Number.isFinite(showId)) notFound()

  const artist = await invoke(getArtistForAdmin, {id: artistId})
  if (!artist) notFound()

  const show = await invoke(getShowForAdmin, {showId, artistId})
  if (!show) notFound()

  return (
    <>
      <h1 className={styles.h1}>Editar show — {artist.displayName ?? artist.slug}</h1>
      <ShowForm
        artistId={artistId}
        showId={showId}
        mode="edit"
        initial={{
          title: show.title,
          startsAt: show.startsAt,
          ticketPurchaseUrl: show.ticketPurchaseUrl,
          addressLine1: show.addressLine1 ?? show.location?.addressLine1 ?? null,
          city: show.city ?? show.location?.city ?? null,
          region: show.region ?? show.location?.region ?? null,
        }}
      />
    </>
  )
}
