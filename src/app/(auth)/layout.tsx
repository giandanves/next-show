/**
 * Auth pages must not call Blitz session helpers during RSC render on Vercel.
 * Session is only needed when submitting login/signup (RPC + SESSION_SECRET_KEY).
 */
export const dynamic = "force-dynamic"

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>
}
