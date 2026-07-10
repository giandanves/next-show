"use client"

import {useRouter} from "next/navigation"
import {useMutation} from "@blitzjs/rpc"
import createArtist from "src/app/artists/mutations/createArtist"
import updateArtist from "src/app/artists/mutations/updateArtist"
import styles from "../admin.module.css"

type ArtistFormProps = {
  mode: "create" | "edit"
  initial?: {
    id: number
    slug: string
    displayName: string | null
    profilePictureUrl: string | null
    socialLinks: string | null
  }
}

export function ArtistForm({mode, initial}: ArtistFormProps) {
  const router = useRouter()
  const [createMutation] = useMutation(createArtist)
  const [updateMutation] = useMutation(updateArtist)

  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const payload = {
          slug: String(fd.get("slug") ?? ""),
          displayName: String(fd.get("displayName") ?? ""),
          profilePictureUrl: String(fd.get("profilePictureUrl") ?? ""),
          socialLinks: String(fd.get("socialLinks") ?? ""),
        }
        try {
          if (mode === "create") {
            const created = await createMutation(payload)
            router.push(`/admin/artists/${created.id}/edit`)
            router.refresh()
          } else if (initial) {
            await updateMutation({...payload, id: initial.id})
            router.refresh()
          }
        } catch (err) {
          alert(err instanceof Error ? err.message : "Erro ao salvar")
        }
      }}
    >
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
      <label className={styles.label}>
        Nome de exibição
        <input className={styles.input} name="displayName" required defaultValue={initial?.displayName ?? ""} />
      </label>
      <label className={styles.label}>
        Foto (URL)
        <input className={styles.input} name="profilePictureUrl" type="url" defaultValue={initial?.profilePictureUrl ?? ""} />
      </label>
      <label className={styles.label}>
        Redes sociais (JSON)
        <textarea
          className={styles.textarea}
          name="socialLinks"
          rows={4}
          placeholder='{"instagram":"https://..."}'
          defaultValue={initial?.socialLinks ?? ""}
        />
      </label>
      <button type="submit" className={styles.button}>
        {mode === "create" ? "Criar artista" : "Salvar"}
      </button>
    </form>
  )
}
