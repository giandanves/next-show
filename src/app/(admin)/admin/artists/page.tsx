"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useQuery} from "@blitzjs/rpc"
import getArtistsForAdmin from "src/app/artists/queries/getArtistsForAdmin"
import {ui} from "../ui"

function ArtistsTable() {
  const [artists] = useQuery(getArtistsForAdmin, null)

  return (
    <>
      <h1 className={ui.h1}>Artistas</h1>
      <div className={ui.actions}>
        <Link href="/admin/artists/new" className={ui.button}>
          Novo artista
        </Link>
      </div>
      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Nome</th>
            <th className={ui.th}>Slug</th>
            <th className={ui.th}>Status</th>
            <th className={ui.th}>Owner</th>
            <th className={ui.th} />
          </tr>
        </thead>
        <tbody>
          {(artists ?? []).map((a) => (
            <tr key={a.id}>
              <td className={ui.td}>{a.displayName ?? a.slug}</td>
              <td className={ui.td}>
                {a.publicationStatus === "PUBLISHED" ? (
                  <Link href={`/${a.slug}`}>{a.slug}</Link>
                ) : (
                  a.slug
                )}
              </td>
              <td className={ui.td}>{a.publicationStatus}</td>
              <td className={ui.td}>{a.owner.email}</td>
              <td className={ui.td}>
                <Link href={`/admin/artists/${a.id}/edit`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default function AdminArtistsPage() {
  return (
    <Suspense fallback={<p className={ui.hint}>Carregando artistas…</p>}>
      <ArtistsTable />
    </Suspense>
  )
}
