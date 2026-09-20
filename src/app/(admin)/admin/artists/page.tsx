"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useQuery} from "@blitzjs/rpc"
import getArtistsForAdmin from "src/app/artists/queries/getArtistsForAdmin"
import styles from "../admin.module.css"

function ArtistsTable() {
  const [artists] = useQuery(getArtistsForAdmin, null)

  return (
    <>
      <h1 className={styles.h1}>Artistas</h1>
      <div className={styles.actions}>
        <Link href="/admin/artists/new" className={styles.button}>
          Novo artista
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Owner</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(artists ?? []).map((a) => (
            <tr key={a.id}>
              <td>{a.displayName ?? a.slug}</td>
              <td>
                {a.publicationStatus === "PUBLISHED" ? (
                  <Link href={`/${a.slug}`}>{a.slug}</Link>
                ) : (
                  a.slug
                )}
              </td>
              <td>{a.publicationStatus}</td>
              <td>{a.owner.email}</td>
              <td>
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
    <Suspense fallback={<p className={styles.hint}>Carregando artistas…</p>}>
      <ArtistsTable />
    </Suspense>
  )
}
