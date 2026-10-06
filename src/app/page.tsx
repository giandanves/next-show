import Link from "next/link"
import {HomeAdminCta} from "./components/HomeAdminCta"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 px-4 py-12 text-center">
        <h1 className="text-4xl font-normal tracking-tight text-primary">next-show</h1>
        <p className="max-w-md text-neutral-700">
          Página pública do artista, área admin e convites de participação.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/giandanves"
            className="inline-flex h-12 w-[200px] max-w-xs items-center justify-center rounded-xl bg-primary px-6 text-[15px] text-white transition hover:shadow-lg hover:shadow-primary/40"
          >
            <strong>Ver artista demo</strong>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 w-[200px] max-w-xs items-center justify-center rounded-xl border border-primary-light bg-white px-6 text-[15px] text-neutral-800 transition hover:bg-secondary-light/40"
          >
            <strong>Login</strong>
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-12 w-[200px] max-w-xs items-center justify-center rounded-xl border border-primary-light bg-white px-6 text-[15px] text-neutral-800 transition hover:bg-secondary-light/40"
          >
            <strong>Sign up</strong>
          </Link>
          <HomeAdminCta />
        </div>
      </main>
      <footer className="flex items-center justify-center gap-1 py-8 text-sm text-neutral-600">
        <span>Powered by</span>
        <a
          href="https://blitzjs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-2 hover:underline"
        >
          Blitz.js
        </a>
      </footer>
    </div>
  )
}
