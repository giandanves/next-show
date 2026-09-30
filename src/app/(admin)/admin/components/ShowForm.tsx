"use client"

import {useRouter} from "next/navigation"
import {useMutation} from "@blitzjs/rpc"
import createShowForArtist from "src/app/shows/mutations/createShowForArtist"
import updateShow from "src/app/shows/mutations/updateShow"
import {AddressAutocomplete} from "./AddressAutocomplete"
import styles from "../admin.module.css"

type ShowFormProps = {
  artistId: number
  mode: "create" | "edit"
  showId?: number
  initial?: {
    title: string | null
    startsAt: Date
    ticketPurchaseUrl: string
    addressLabel: string | null
  }
}

function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function ShowForm({artistId, mode, showId, initial}: ShowFormProps) {
  const router = useRouter()
  const [createMutation] = useMutation(createShowForArtist)
  const [updateMutation] = useMutation(updateShow)

  const startsAtDefault = initial ? toDatetimeLocalValue(new Date(initial.startsAt)) : ""

  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const placeRef = String(fd.get("placeRef") ?? "")
        const houseNumber = String(fd.get("houseNumber") ?? "").trim()
        const payload = {
          title: String(fd.get("title") ?? ""),
          startsAt: String(fd.get("startsAt") ?? ""),
          ticketPurchaseUrl: String(fd.get("ticketPurchaseUrl") ?? ""),
          houseNumber: houseNumber || undefined,
        }
        try {
          if (mode === "create") {
            const created = await createMutation({...payload, placeRef, artistId})
            router.push(`/admin/artists/${artistId}/shows/${created.id}/edit`)
            router.refresh()
          } else if (showId) {
            await updateMutation({...payload, placeRef: placeRef || undefined, showId})
            router.refresh()
          }
        } catch (err) {
          alert(err instanceof Error ? err.message : "Erro ao salvar show")
        }
      }}
    >
      <label className={styles.label}>
        Título
        <input className={styles.input} name="title" required defaultValue={initial?.title ?? ""} />
      </label>
      <label className={styles.label}>
        Data e hora
        <input className={styles.input} name="startsAt" type="datetime-local" required defaultValue={startsAtDefault} />
      </label>
      <label className={styles.label}>
        Link de ingressos
        <input
          className={styles.input}
          name="ticketPurchaseUrl"
          type="url"
          required
          defaultValue={initial?.ticketPurchaseUrl ?? ""}
        />
      </label>
      <AddressAutocomplete
        name="placeRef"
        houseNumberName="houseNumber"
        label="Local"
        initialLabel={initial?.addressLabel}
        required={mode === "create"}
      />
      <button type="submit" className={styles.button}>
        {mode === "create" ? "Criar show" : "Salvar show"}
      </button>
    </form>
  )
}
