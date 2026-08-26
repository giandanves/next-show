import {redirect} from "next/navigation"
import {getBlitzContext} from "../blitz-server"

// Auth pages read session cookies — never statically prerender them.
export const dynamic = "force-dynamic"

export default async function AuthLayout({children}: {children: React.ReactNode}) {
  try {
    const ctx = await getBlitzContext()
    if (ctx.session.userId) {
      redirect("/")
    }
  } catch (error) {
    console.error("[auth/layout] session check failed", error)
  }

  return <>{children}</>
}
