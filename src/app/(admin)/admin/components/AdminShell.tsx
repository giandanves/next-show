"use client"

import Link from "next/link"
import {useRouter} from "next/navigation"
import {ReactNode, Suspense, useEffect} from "react"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import {isPlatformAdmin, isPlatformCreatorOrAdmin} from "src/lib/artistAccess"
import type {Role} from "types"
import {ui} from "../ui"

function AdminGate({children}: {children: ReactNode}) {
  // useSuspenseQuery: this component only mounts after getCurrentUser resolves.
  // null === logged out; never treat "loading" as logged out (that canceled the RPC).
  const user = useCurrentUser()
  const router = useRouter()
  const role = user?.role as Role | undefined

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
    return <p className={ui.hint}>Redirecionando para login…</p>
  }

  if (!isPlatformCreatorOrAdmin(user.role as Role)) {
    return <p className={ui.hint}>Sem permissão…</p>
  }

  return (
    <div className={ui.shell}>
      <nav className={ui.nav} aria-label="Admin">
        <Link href="/admin" className={ui.navLink}>
          Dashboard
        </Link>
        <Link href="/admin/artists" className={ui.navLink}>
          Artistas
        </Link>
        <Link href="/admin/venues" className={ui.navLink}>
          Venues
        </Link>
        {role && isPlatformAdmin(role) && (
          <Link href="/admin/approvals" className={ui.navLink}>
            Aprovações
          </Link>
        )}
        <Link href="/" className={ui.navLink}>
          Site público
        </Link>
      </nav>
      {children}
    </div>
  )
}

/** Auth + shell via Blitz RPC. Avoids server `invoke` and loading/auth race. */
export function AdminShell({children}: {children: ReactNode}) {
  return (
    <Suspense fallback={<p className={ui.hint}>Carregando sessão…</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  )
}
