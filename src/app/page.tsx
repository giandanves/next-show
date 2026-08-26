import Link from "next/link"
import styles from "./styles/Home.module.css"

export const dynamic = "force-dynamic"

/**
 * Home avoids Blitz `invoke` / session on the server.
 * Touching session in RSC on Vercel crashes the page when SESSION_SECRET_KEY
 * is missing or Blitz auth fails during render.
 */
export default function Home() {
  return (
    <>
      <div className={styles.globe} />
      <div className={styles.container}>
        <div className={styles.toastContainer}>
          <p>
            <strong>next-show</strong> — demo de artistas, shows e agenda pública.
          </p>
        </div>

        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <h1>next-show</h1>
              <p style={{marginTop: "0.75rem", maxWidth: "28rem"}}>
                Página pública do artista, área admin e convites de participação.
              </p>

              <div className={styles.buttonContainer}>
                <Link href="/giandanves" className={styles.button}>
                  <strong>Ver artista demo</strong>
                </Link>
                <Link href="/login" className={styles.loginButton}>
                  <strong>Login</strong>
                </Link>
                <Link href="/signup" className={styles.loginButton}>
                  <strong>Sign up</strong>
                </Link>
                <Link href="/admin" className={styles.loginButton}>
                  <strong>Admin</strong>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <span>Powered by</span>
          <a
            href="https://blitzjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.textLink}
          >
            Blitz.js
          </a>
        </footer>
      </div>
    </>
  )
}
