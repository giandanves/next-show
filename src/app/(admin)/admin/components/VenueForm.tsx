"use client"

import {useRouter} from "next/navigation"
import {useMutation} from "@blitzjs/rpc"
import createVenue from "src/app/venues/mutations/createVenue"
import updateVenue from "src/app/venues/mutations/updateVenue"
import {AddressAutocomplete} from "./AddressAutocomplete"
import styles from "../admin.module.css"

type VenueFormProps = {
  mode: "create" | "edit"
  initial?: {
    id: number
    name: string
    slug: string
    addressLabel: string | null
  }
}

export function VenueForm({mode, initial}: VenueFormProps) {
  const router = useRouter()
  const [createMutation] = useMutation(createVenue)
  const [updateMutation] = useMutation(updateVenue)

  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const placeRef = String(fd.get("placeRef") ?? "")
        const houseNumber = String(fd.get("houseNumber") ?? "").trim()
        const payload = {
          name: String(fd.get("name") ?? ""),
          slug: String(fd.get("slug") ?? ""),
          houseNumber: houseNumber || undefined,
        }
        try {
          if (mode === "create") {
            const created = await createMutation({...payload, placeRef})
            router.push(`/admin/venues/${created.id}/edit`)
            router.refresh()
          } else if (initial) {
            await updateMutation({
              ...payload,
              id: initial.id,
              placeRef: placeRef || undefined,
            })
            router.refresh()
          }
        } catch (err) {
          alert(err instanceof Error ? err.message : "Erro ao salvar")
        }
      }}
    >
      <label className={styles.label}>
        Nome
        <input className={styles.input} name="name" required defaultValue={initial?.name ?? ""} />
      </label>
      <label className={styles.label}>
        Slug (URL)
        <input
          className={styles.input}
          name="slug"
          required
          defaultValue={initial?.slug ?? ""}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
        />
      </label>
      <AddressAutocomplete
        name="placeRef"
        houseNumberName="houseNumber"
        label="Endereço"
        initialLabel={initial?.addressLabel}
        required={mode === "create"}
      />
      <button type="submit" className={styles.button}>
        {mode === "create" ? "Criar venue" : "Salvar"}
      </button>
    </form>
  )
}
