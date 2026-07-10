import Link from "next/link"
import {notFound} from "next/navigation"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import getArtistMembers from "src/app/artists/queries/getArtistMembers"
import {invoke} from "src/app/blitz-server"
import {MemberForm} from "../../../components/MemberForm"
import styles from "../../../admin.module.css"

export default async function ArtistMembersPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const artistId = Number(id)
  if (!Number.isFinite(artistId)) notFound()

  const artist = await invoke(getArtistForAdmin, {id: artistId})
  if (!artist) notFound()

  const members = await invoke(getArtistMembers, {artistId})

  return (
    <>
      <h1 className={styles.h1}>Membros — {artist.displayName ?? artist.slug}</h1>
      <p className={styles.hint}>
        <Link href={`/admin/artists/${artistId}/edit`}>Voltar ao artista</Link>
      </p>
      <MemberForm artistId={artistId} members={members} />
    </>
  )
}
