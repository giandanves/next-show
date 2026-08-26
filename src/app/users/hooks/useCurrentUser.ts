"use client"

import {useSuspenseQuery} from "@blitzjs/rpc"
import getCurrentUser from "../queries/getCurrentUser"

/** Suspends until the RPC finishes. `null` means logged out (not “still loading”). */
export const useCurrentUser = () => {
  const [user] = useSuspenseQuery(getCurrentUser, null)
  return user
}
