"use client"

import {useRouter} from "next/navigation"
import {useMutation} from "@blitzjs/rpc"
import addArtistMember from "src/app/artists/mutations/addArtistMember"
import removeArtistMember from "src/app/artists/mutations/removeArtistMember"
import styles from "../admin.module.css"

type Member = {
  id: number
  role: string
  user: {id: number; email: string; name: string | null}
}

export function MemberForm({artistId, members}: {artistId: number; members: Member[]}) {
  const router = useRouter()
  const [addMutation] = useMutation(addArtistMember)
  const [removeMutation] = useMutation(removeArtistMember)

  return (
    <>
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          try {
            await addMutation({
              artistId,
              email: String(fd.get("email") ?? ""),
            })
            e.currentTarget.reset()
            router.refresh()
          } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao adicionar membro")
          }
        }}
      >
        <label className={styles.label}>
          Email do editor
          <input className={styles.input} name="email" type="email" required />
        </label>
        <button type="submit" className={styles.button}>
          Adicionar editor
        </button>
      </form>

      {members.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Papel</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.user.email}</td>
                <td>{m.role}</td>
                <td>
                  <button
                    type="button"
                    className={styles.buttonSecondary}
                    onClick={async () => {
                      if (!confirm("Remover este editor?")) return
                      try {
                        await removeMutation({artistId, memberId: m.id})
                        router.refresh()
                      } catch (err) {
                        alert(err instanceof Error ? err.message : "Erro ao remover")
                      }
                    }}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.hint}>Nenhum editor delegado.</p>
      )}
    </>
  )
}
