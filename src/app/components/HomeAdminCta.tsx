"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import {isPlatformCreatorOrAdmin} from "src/lib/artistAccess"
import type {Role} from "types"
import styles from "../styles/Home.module.css"

function HomeAdminLink() {
  const user = useCurrentUser()
  if (!user || !isPlatformCreatorOrAdmin(user.role as Role)) {
    return null
  }
  return (
    <Link href="/admin" className={styles.loginButton}>
      <strong>Admin</strong>
    </Link>
  )
}

/** Client-only Admin CTA — avoids Blitz session/invoke in the home RSC. */
export function HomeAdminCta() {
  return (
    <Suspense fallback={null}>
      <HomeAdminLink />
    </Suspense>
  )
}
