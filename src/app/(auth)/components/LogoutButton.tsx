"use client"

import logout from "../mutations/logout"
import {useRouter} from "next/navigation"
import {useMutation} from "@blitzjs/rpc"

export function LogoutButton() {
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  return (
    <button
      type="button"
      className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-[15px] text-white transition hover:shadow-lg hover:shadow-primary/40"
      onClick={async () => {
        await logoutMutation()
        router.refresh()
      }}
    >
      Logout
    </button>
  )
}
