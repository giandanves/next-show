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
import styles from "../admin.module.css"

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
      <h1 className={styles.h1}>Aprovações</h1>
      <p className={styles.hint}>
        Artistas e venues criados por producers ficam PENDING até um ADMIN publicar.
      </p>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <h2 className={styles.h2}>Artistas pendentes</h2>
      {artists.length === 0 ? (
        <p className={styles.hint}>Nenhum artista pendente.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Owner</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {artists.map((a) => (
              <tr key={a.id}>
                <td>{a.displayName ?? a.slug}</td>
                <td>{a.slug}</td>
                <td>{a.owner.name ? `${a.owner.name} (${a.owner.email})` : a.owner.email}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/artists/${a.id}/edit`} className={styles.buttonSecondary}>
                      Revisar
                    </Link>
                    <button
                      type="button"
                      className={styles.button}
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

      <h2 className={styles.h2}>Venues pendentes</h2>
      {venues.length === 0 ? (
        <p className={styles.hint}>Nenhum venue pendente.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Cidade</th>
              <th>Owner</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {venues.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.slug}</td>
                <td>{v.city ?? "—"}</td>
                <td>{v.owner.name ? `${v.owner.name} (${v.owner.email})` : v.owner.email}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/venues/${v.id}/edit`} className={styles.buttonSecondary}>
                      Revisar
                    </Link>
                    <button
                      type="button"
                      className={styles.button}
                      disabled={busyId === `venue-${v.id}`}
                      onClick={() => onApproveVenue(v.id)}
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
    return <p className={styles.hint}>Apenas ADMIN pode ver aprovações…</p>
  }

  return <ApprovalsList />
}

export default function AdminApprovalsPage() {
  return (
    <Suspense fallback={<p className={styles.hint}>Carregando aprovações…</p>}>
      <ApprovalsGate />
    </Suspense>
  )
}
