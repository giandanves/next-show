"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import {isPlatformAdmin} from "src/lib/artistAccess"
import type {Role} from "types"
import styles from "./admin.module.css"

function AdminDashboardLinks() {
  const user = useCurrentUser()
  const isAdmin = user && isPlatformAdmin(user.role as Role)

  return (
    <div className={styles.actions}>
      <Link href="/admin/artists" className={styles.button}>
        Artistas
      </Link>
      <Link href="/admin/venues" className={styles.buttonSecondary}>
        Venues
      </Link>
      {isAdmin && (
        <Link href="/admin/approvals" className={styles.buttonSecondary}>
          Aprovações
        </Link>
      )}
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className={styles.h1}>Admin</h1>
      <p className={styles.hint}>Gerencie artistas, shows e venues.</p>
      <Suspense fallback={<div className={styles.actions} />}>
        <AdminDashboardLinks />
      </Suspense>
    </>
  )
}
