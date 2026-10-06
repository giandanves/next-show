"use client"

import {useEffect, useId, useRef, useState} from "react"
import {extractHouseNumber} from "src/lib/geo/parse"
import type {PlaceSuggestion} from "src/lib/geo/types"
import {ui} from "../ui"

type AddressAutocompleteProps = {
  /** Name of the hidden input that receives the selected place reference. */
  name: string
  /** Name of the house number input shown when the picked place is a street without a number. */
  houseNumberName: string
  label: string
  /** Current saved address (edit mode). Keeping it unchanged submits no place reference. */
  initialLabel?: string | null
  required?: boolean
}

export function AddressAutocomplete({
  name,
  houseNumberName,
  label,
  initialLabel,
  required,
}: AddressAutocompleteProps) {
  const initialText = initialLabel ?? ""
  const [query, setQuery] = useState(initialText)
  const [selected, setSelected] = useState<PlaceSuggestion | null>(null)
  const [houseNumber, setHouseNumber] = useState("")
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const mustPick = !selected && (required || query !== initialText)

  useEffect(() => {
    inputRef.current?.setCustomValidity(mustPick ? "Selecione um endereço da lista" : "")
  }, [mustPick])

  useEffect(() => {
    const q = query.trim()
    if (selected || q === initialText.trim() || q.length < 3) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setStatus("loading")
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Search failed (${res.status})`)
        const body = (await res.json()) as {suggestions: PlaceSuggestion[]}
        setSuggestions(body.suggestions)
        setStatus("idle")
      } catch {
        if (!controller.signal.aborted) setStatus("error")
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, selected, initialText])

  return (
    <div className={ui.label}>
      <label htmlFor={`${listId}-input`}>{label}</label>
      <input
        ref={inputRef}
        id={`${listId}-input`}
        className={ui.input}
        value={query}
        autoComplete="off"
        placeholder="Nome do local, rua, número, bairro…"
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls={listId}
        onChange={(e) => {
          setQuery(e.target.value)
          setSelected(null)
        }}
      />
      <input type="hidden" name={name} value={selected?.placeRef ?? ""} />

      {suggestions.length > 0 && (
        <ul id={listId} role="listbox" className={ui.suggestions}>
          {suggestions.map((s) => (
            <li key={s.placeRef} role="option" aria-selected={false}>
              <button
                type="button"
                className={ui.suggestionButton}
                onClick={() => {
                  setSelected(s)
                  setHouseNumber(extractHouseNumber(query) ?? "")
                  setQuery(s.label)
                  setSuggestions([])
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {status === "loading" && <span className={ui.hint}>Buscando endereços…</span>}
      {status === "error" && (
        <span className={ui.error}>Busca de endereço indisponível. Tente novamente.</span>
      )}
      {selected && <span className={ui.hint}>Endereço validado.</span>}

      {selected?.needsHouseNumber && (
        <label className={ui.label}>
          Número
          <input
            className={ui.input}
            name={houseNumberName}
            value={houseNumber}
            inputMode="numeric"
            pattern="\d{1,6}[A-Za-z]?"
            placeholder="Ex.: 123"
            onChange={(e) => setHouseNumber(e.target.value)}
          />
          <span className={ui.hint}>
            Essa rua não tem números mapeados; informe o número do local.
          </span>
        </label>
      )}
    </div>
  )
}
