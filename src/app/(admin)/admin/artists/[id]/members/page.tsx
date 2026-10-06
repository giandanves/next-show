"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useParams} from "next/navigation"
import {useQuery} from "@blitzjs/rpc"
import getArtistForAdmin from "src/app/artists/queries/getArtistForAdmin"
import getArtistMembers from "src/app/artists/queries/getArtistMembers"
import {MemberForm} from "../../../components/MemberForm"
import {ui} from "../../../ui"

function ArtistMembers() {
  const params = useParams()
  const artistId = Number(params?.id)
  const [artist] = useQuery(getArtistForAdmin, {id: artistId}, {enabled: Number.isFinite(artistId)})
  const [members] = useQuery(getArtistMembers, {artistId}, {enabled: Number.isFinite(artistId)})

  if (!Number.isFinite(artistId) || !artist) {
    return <p className={ui.error}>Artista não encontrado.</p>
  }

  return (
    <>
      <h1 className={ui.h1}>Membros — {artist.displayName ?? artist.slug}</h1>
      <p className={ui.hint}>
        <Link href={`/admin/artists/${artistId}/edit`}>Voltar ao artista</Link>
      </p>
      <MemberForm artistId={artistId} members={members ?? []} />
    </>
  )
}

export default function ArtistMembersPage() {
  return (
    <Suspense fallback={<p className={ui.hint}>Carregando…</p>}>
      <ArtistMembers />
    </Suspense>
  )
}
