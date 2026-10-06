"use client"

import {useEffect, useState} from "react"
import {useMutation, useQuery} from "@blitzjs/rpc"
import transferVenueOwnership from "src/app/venues/mutations/transferVenueOwnership"
import searchEligibleVenueOwners from "src/app/venues/queries/searchEligibleVenueOwners"
import {ui} from "../ui"

type TransferVenueOwnershipProps = {
  venueId: number
  currentOwnerUserId: number
  onTransferred?: () => void
}

export function TransferVenueOwnership({
  venueId,
  currentOwnerUserId,
  onTransferred,
}: TransferVenueOwnershipProps) {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 250)
    return () => clearTimeout(timer)
  }, [query])

  const [candidates] = useQuery(
    searchEligibleVenueOwners,
    {query: debounced},
    {enabled: debounced.length >= 2},
  )
  const [transferMutation] = useMutation(transferVenueOwnership)

  const options = (candidates ?? []).filter((u) => u.id !== currentOwnerUserId)

  return (
    <section className={ui.form}>
      <h2 className={ui.h2}>Transferir ownership</h2>
      <p className={ui.hint}>
        Um ADMIN pode criar a venue e depois passar a ownership completa para um CREATOR.
      </p>
      <label className={ui.label}>
        Buscar CREATOR ou ADMIN
        <input
          className={ui.input}
          value={query}
          placeholder="Email ou nome"
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedUserId(null)
            setError(null)
          }}
        />
      </label>

      {options.length > 0 && (
        <ul className={ui.suggestions} role="listbox">
          {options.map((u) => (
            <li key={u.id} role="option" aria-selected={selectedUserId === u.id}>
              <button
                type="button"
                className={ui.suggestionButton}
                onClick={() => {
                  setSelectedUserId(u.id)
                  setQuery(u.name ? `${u.name} (${u.email})` : u.email)
                }}
              >
                {u.name ? `${u.name} · ${u.email}` : u.email} · {u.role}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className={ui.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        className={ui.button}
        disabled={!selectedUserId || busy}
        onClick={async () => {
          if (!selectedUserId) return
          setBusy(true)
          setError(null)
          try {
            await transferMutation({venueId, newOwnerUserId: selectedUserId})
            setQuery("")
            setSelectedUserId(null)
            onTransferred?.()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Falha ao transferir")
          } finally {
            setBusy(false)
          }
        }}
      >
        Transferir ownership
      </button>
    </section>
  )
}
