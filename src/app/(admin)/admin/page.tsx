"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import {isPlatformAdmin} from "src/lib/artistAccess"
import type {Role} from "types"
import {ui} from "./ui"

function AdminDashboardLinks() {
  const user = useCurrentUser()
  const isAdmin = user && isPlatformAdmin(user.role as Role)

  return (
    <div className={ui.actions}>
      <Link href="/admin/artists" className={ui.button}>
        Artistas
      </Link>
      <Link href="/admin/venues" className={ui.buttonSecondary}>
        Venues
      </Link>
      {isAdmin && (
        <Link href="/admin/approvals" className={ui.buttonSecondary}>
          Aprovações
        </Link>
      )}
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className={ui.h1}>Admin</h1>
      <p className={ui.hint}>Gerencie artistas, shows e venues.</p>
      <Suspense fallback={<div className={ui.actions} />}>
        <AdminDashboardLinks />
      </Suspense>
    </>
  )
}
