"use client"

import Link from "next/link"
import {Suspense, useEffect, useState} from "react"
import {useMutation, useQuery} from "@blitzjs/rpc"
import {useRouter} from "next/navigation"
import {useCurrentUser} from "src/app/users/hooks/useCurrentUser"
import {isPlatformAdmin} from "src/lib/artistAccess"
import type {Role} from "types"
import approveArtist from "src/app/artists/mutations/approveArtist"
import approveVenue from "src/app/venues/mutations/approveVenue"
import getPendingApprovals from "src/app/admin/queries/getPendingApprovals"
import {ui} from "../ui"

function ApprovalsList() {
  const [pending, {refetch}] = useQuery(getPendingApprovals, null)
  const [approveArtistMutation] = useMutation(approveArtist)
  const [approveVenueMutation] = useMutation(approveVenue)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const artists = pending?.artists ?? []
  const venues = pending?.venues ?? []

  async function onApproveArtist(id: number) {
    setError(null)
    setBusyId(`artist-${id}`)
    try {
      await approveArtistMutation({id})
      await refetch()
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setBusyId(null)
    }
  }

  async function onApproveVenue(id: number) {
    setError(null)
    setBusyId(`venue-${id}`)
    try {
      await approveVenueMutation({id})
      await refetch()
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <h1 className={ui.h1}>Aprovações</h1>
      <p className={ui.hint}>
        Artistas e venues criados por producers ficam PENDING até um ADMIN publicar.
      </p>
      {error && (
        <p className={ui.error} role="alert">
          {error}
        </p>
      )}

      <h2 className={ui.h2}>Artistas pendentes</h2>
      {artists.length === 0 ? (
        <p className={ui.hint}>Nenhum artista pendente.</p>
      ) : (
        <table className={ui.table}>
          <thead>
            <tr>
              <th className={ui.th}>Nome</th>
              <th className={ui.th}>Slug</th>
              <th className={ui.th}>Owner</th>
              <th className={ui.th} />
            </tr>
          </thead>
          <tbody>
            {artists.map((a) => (
              <tr key={a.id}>
                <td className={ui.td}>{a.displayName ?? a.slug}</td>
                <td className={ui.td}>{a.slug}</td>
                <td className={ui.td}>{a.owner.name ? `${a.owner.name} (${a.owner.email})` : a.owner.email}</td>
                <td className={ui.td}>
                  <div className={ui.actions}>
                    <Link href={`/admin/artists/${a.id}/edit`} className={ui.buttonSecondary}>
                      Revisar
                    </Link>
                    <button
                      type="button"
                      className={ui.button}
                      disabled={busyId === `artist-${a.id}`}
                      onClick={() => onApproveArtist(a.id)}
                    >
                      Aprovar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className={ui.h2}>Venues pendentes</h2>
      {venues.length === 0 ? (
        <p className={ui.hint}>Nenhum venue pendente.</p>
      ) : (
        <table className={ui.table}>
          <thead>
            <tr>
              <th className={ui.th}>Nome</th>
              <th className={ui.th}>Slug</th>
              <th className={ui.th}>Cidade</th>
              <th className={ui.th} />
            </tr>
          </thead>
          <tbody>
            {venues.map((v) => (
              <tr key={v.id}>
                <td className={ui.td}>{v.name}</td>
                <td className={ui.td}>{v.slug}</td>
                <td className={ui.td}>{v.city ?? "—"}</td>
                <td className={ui.td}>
                  <button
                    type="button"
                    className={ui.button}
                    disabled={busyId === `venue-${v.id}`}
                    onClick={() => onApproveVenue(v.id)}
                  >
                    Aprovar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

function ApprovalsGate() {
  const user = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (user && !isPlatformAdmin(user.role as Role)) {
      router.replace("/admin")
    }
  }, [user, router])

  if (!user || !isPlatformAdmin(user.role as Role)) {
    return <p className={ui.hint}>Apenas ADMIN pode ver aprovações…</p>
  }

  return <ApprovalsList />
}

export default function AdminApprovalsPage() {
  return (
    <Suspense fallback={<p className={ui.hint}>Carregando aprovações…</p>}>
      <ApprovalsGate />
    </Suspense>
  )
}
