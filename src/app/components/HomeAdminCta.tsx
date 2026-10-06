"use client"

import Link from "next/link"
import {Suspense} from "react"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import {isPlatformCreatorOrAdmin} from "src/lib/artistAccess"
import type {Role} from "types"

function HomeAdminLink() {
  const user = useCurrentUser()
  if (!user || !isPlatformCreatorOrAdmin(user.role as Role)) {
    return null
  }
  return (
    <Link
      href="/admin"
      className="inline-flex h-12 w-[200px] max-w-xs items-center justify-center rounded-xl border border-primary-light bg-white px-6 text-[15px] text-neutral-800 transition hover:bg-secondary-light/40"
    >
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
