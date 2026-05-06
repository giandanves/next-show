import {notFound} from "next/navigation"
import getArtistBySlug from "../artists/queries/getArtistBySlug"
import {invoke} from "../blitz-server"
import styles from "./ArtistProfile.module.css"

type ShowForAddress = {
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  country: string | null
  location: {
    label: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    region: string | null
    postalCode: string | null
    country: string | null
  } | null
}

function compactParts(...parts: (string | null | undefined)[]): string[] {
  return parts.flatMap((p) => {
    const s = p?.trim()
    return s ? [s] : []
  })
}

function formatShowAddress(show: ShowForAddress): string {
  const loc = show.location
  if (loc) {
    const cityRegion = [loc.city, loc.region].filter(Boolean).join(", ")
    return compactParts(
      loc.label,
      loc.addressLine1,
      loc.addressLine2,
      cityRegion || undefined,
      loc.postalCode,
      loc.country,
    ).join(" · ")
  }
  const cityRegion = [show.city, show.region].filter(Boolean).join(", ")
  return compactParts(
    show.addressLine1,
    show.addressLine2,
    cityRegion || undefined,
    show.postalCode,
    show.country,
  ).join(" · ")
}

function parseSocialLinks(raw: string | null): Record<string, string> | null {
  if (!raw?.trim()) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null
    const out: Record<string, string> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) out[key] = value.trim()
    }
    return Object.keys(out).length ? out : null
  } catch {
    return null
  }
}

function platformLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatShowDateTime(startsAt: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(startsAt)
}

export default async function ArtistPublicPage({
  params,
}: {
  params: Promise<{displayName: string}>
}) {
  const {displayName} = await params
  const artist = await invoke(getArtistBySlug, {slug: displayName})
  if (!artist) notFound()

  const heading = artist.displayName ?? artist.slug
  const social = parseSocialLinks(artist.socialLinks)

  return (
    <div className={styles.page}>
      <article>
        <h1 className={styles.title}>{heading}</h1>

        {social ? (
          <section aria-label="Social links">
            <h2 className={styles.sectionTitle}>Redes</h2>
            <ul className={styles.socialList}>
              {Object.entries(social).map(([platform, url]) => (
                <li key={platform}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {platformLabel(platform)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-label="Shows">
          <h2 className={styles.sectionTitle}>Shows</h2>
          {artist.showLinks.length === 0 ? (
            <p className={styles.showMeta}>Nenhum show cadastrado.</p>
          ) : (
            <ul className={styles.showList}>
              {artist.showLinks.map(({show}) => {
                const addressText = formatShowAddress(show)
                const title = show.title?.trim() || "Show"
                return (
                  <li key={show.id} className={styles.showItem}>
                    <h3 className={styles.showTitle}>{title}</h3>
                    <p className={styles.showDate}>
                      <time dateTime={show.startsAt.toISOString()}>{formatShowDateTime(show.startsAt)}</time>
                    </p>
                    {addressText ? (
                      <p className={styles.showMeta}>{addressText}</p>
                    ) : (
                      <p className={styles.showMeta}>Endereço a confirmar</p>
                    )}
                    <a
                      className={styles.ticketLink}
                      href={show.ticketPurchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Comprar ingressos
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </article>
    </div>
  )
}
