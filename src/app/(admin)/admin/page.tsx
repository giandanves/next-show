import Link from "next/link"
import styles from "./admin.module.css"

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className={styles.h1}>Admin</h1>
      <p className={styles.hint}>Gerencie artistas, shows e venues.</p>
      <div className={styles.actions}>
        <Link href="/admin/artists" className={styles.button}>
          Artistas
        </Link>
        <Link href="/admin/venues" className={styles.buttonSecondary}>
          Venues
        </Link>
      </div>
    </>
  )
}
