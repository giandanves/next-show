"use client"

import {useRouter} from "next/navigation"
import {useMutation} from "@blitzjs/rpc"
import addArtistMember from "src/app/artists/mutations/addArtistMember"
import removeArtistMember from "src/app/artists/mutations/removeArtistMember"
import {ui} from "../ui"

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
        className={ui.form}
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
        <label className={ui.label}>
          Email do editor
          <input className={ui.input} name="email" type="email" required />
        </label>
        <button type="submit" className={ui.button}>
          Adicionar editor
        </button>
      </form>

      {members.length > 0 ? (
        <table className={ui.table}>
          <thead>
            <tr>
              <th className={ui.th}>Email</th>
              <th className={ui.th}>Papel</th>
              <th className={ui.th} />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className={ui.td}>{m.user.email}</td>
                <td className={ui.td}>{m.role}</td>
                <td className={ui.td}>
                  <button
                    type="button"
                    className={ui.buttonSecondary}
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
        <p className={ui.hint}>Nenhum editor delegado.</p>
      )}
    </>
  )
}
