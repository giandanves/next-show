import Link from "next/link"
import getArtistsForAdmin from "src/app/artists/queries/getArtistsForAdmin"
import {invoke} from "src/app/blitz-server"
import styles from "../admin.module.css"

export default async function AdminArtistsPage() {
  const artists = await invoke(getArtistsForAdmin, null)

  return (
    <>
      <h1 className={styles.h1}>Artistas</h1>
      <div className={styles.actions}>
        <Link href="/admin/artists/new" className={styles.button}>
          Novo artista
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
            <th>Owner</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {artists.map((a) => (
            <tr key={a.id}>
              <td>{a.displayName ?? a.slug}</td>
              <td>
                <Link href={`/${a.slug}`}>{a.slug}</Link>
              </td>
              <td>{a.owner.email}</td>
              <td>
                <Link href={`/admin/artists/${a.id}/edit`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
