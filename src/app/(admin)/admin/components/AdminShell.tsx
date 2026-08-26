"use client"

import Link from "next/link"
import {useRouter} from "next/navigation"
import {ReactNode, Suspense, useEffect} from "react"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import {isPlatformCreatorOrAdmin} from "src/lib/artistAccess"
import type {Role} from "types"
import styles from "../admin.module.css"

function AdminGate({children}: {children: ReactNode}) {
  // useSuspenseQuery: this component only mounts after getCurrentUser resolves.
  // null === logged out; never treat "loading" as logged out (that canceled the RPC).
  const user = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.replace("/login?next=/admin")
      return
    }
    if (!isPlatformCreatorOrAdmin(user.role as Role)) {
      router.replace("/")
    }
  }, [user, router])

  if (user === null) {
    return <p className={styles.hint}>Redirecionando para login…</p>
  }

  if (!isPlatformCreatorOrAdmin(user.role as Role)) {
    return <p className={styles.hint}>Sem permissão…</p>
  }

  return (
    <div className={styles.shell}>
      <nav className={styles.nav} aria-label="Admin">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/artists">Artistas</Link>
        <Link href="/admin/venues">Venues</Link>
        <Link href="/">Site público</Link>
      </nav>
      {children}
    </div>
  )
}

/** Auth + shell via Blitz RPC. Avoids server `invoke` and loading/auth race. */
export function AdminShell({children}: {children: ReactNode}) {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando sessão…</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  )
}
