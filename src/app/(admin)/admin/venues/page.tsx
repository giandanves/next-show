"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useQuery} from "@blitzjs/rpc"
import getVenuesForAdmin from "src/app/venues/queries/getVenuesForAdmin"
import styles from "../admin.module.css"

function VenuesTable() {
  const [venues] = useQuery(getVenuesForAdmin, null)

  return (
    <>
      <h1 className={styles.h1}>Venues</h1>
      <div className={styles.actions}>
        <Link href="/admin/venues/new" className={styles.button}>
          Nova venue
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
            <th>Cidade</th>
            <th>Status</th>
            <th>Owner</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(venues ?? []).map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.slug}</td>
              <td>{[v.city, v.region].filter(Boolean).join(", ") || "—"}</td>
              <td>{v.publicationStatus}</td>
              <td>{v.owner.name ? `${v.owner.name} (${v.owner.email})` : v.owner.email}</td>
              <td>
                <Link href={`/admin/venues/${v.id}/edit`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default function AdminVenuesPage() {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando venues…</p>}>
      <VenuesTable />
    </Suspense>
  )
}
