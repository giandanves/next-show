import Link from "next/link"
import {redirect} from "next/navigation"
import {ReactNode} from "react"
import getCurrentUser from "src/app/users/queries/getCurrentUser"
import {invoke} from "src/app/blitz-server"
import {isPlatformCreatorOrAdmin} from "src/lib/artistAccess"
import type {Role} from "types"
import styles from "./admin.module.css"

export default async function AdminLayout({children}: {children: ReactNode}) {
  const user = await invoke(getCurrentUser, null)
  if (!user) redirect("/login?next=/admin")
  if (!isPlatformCreatorOrAdmin(user.role as Role)) redirect("/")

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
