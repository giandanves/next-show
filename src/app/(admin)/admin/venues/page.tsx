"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useQuery} from "@blitzjs/rpc"
import getVenuesForAdmin from "src/app/venues/queries/getVenuesForAdmin"
import {ui} from "../ui"

function VenuesTable() {
  const [venues] = useQuery(getVenuesForAdmin, null)

  return (
    <>
      <h1 className={ui.h1}>Venues</h1>
      <div className={ui.actions}>
        <Link href="/admin/venues/new" className={ui.button}>
          Nova venue
        </Link>
      </div>
      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Nome</th>
            <th className={ui.th}>Slug</th>
            <th className={ui.th}>Cidade</th>
            <th className={ui.th}>Status</th>
            <th className={ui.th}>Owner</th>
            <th className={ui.th} />
          </tr>
        </thead>
        <tbody>
          {(venues ?? []).map((v) => (
            <tr key={v.id}>
              <td className={ui.td}>{v.name}</td>
              <td className={ui.td}>{v.slug}</td>
              <td className={ui.td}>{[v.city, v.region].filter(Boolean).join(", ") || "—"}</td>
              <td className={ui.td}>{v.publicationStatus}</td>
              <td className={ui.td}>{v.owner.name ? `${v.owner.name} (${v.owner.email})` : v.owner.email}</td>
              <td className={ui.td}>
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
    <Suspense fallback={<p className={ui.hint}>Carregando venues…</p>}>
      <VenuesTable />
    </Suspense>
  )
}
