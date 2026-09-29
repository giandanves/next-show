import Link from "next/link"
import {notFound} from "next/navigation"
import {fetchShowById} from "../showPublicData"
import {formatShowAddress, formatShowDateTime} from "src/lib/showFormatting"
import {PUBLICATION_STATUS_PUBLISHED} from "src/lib/publicationStatus"
import styles from "./ShowEvent.module.css"

type ShowForAddress = Parameters<typeof formatShowAddress>[0]

function venueAsAddress(venue: {
  name: string
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  country: string | null
}): ShowForAddress {
  return {
    addressLine1: venue.addressLine1,
    addressLine2: venue.addressLine2,
    city: venue.city,
    region: venue.region,
    postalCode: venue.postalCode,
    country: venue.country,
    location: {
      label: venue.name,
      addressLine1: venue.addressLine1,
      addressLine2: venue.addressLine2,
      city: venue.city,
      region: venue.region,
      postalCode: venue.postalCode,
      country: venue.country,
    },
  }
}

export default async function PublicShowPage({
  params,
}: {
  params: Promise<{showId: string}>
}) {
  const {showId: raw} = await params
  const showId = Number.parseInt(raw, 10)
  const show = await fetchShowById(showId)
  if (!show) notFound()

  const title = show.title?.trim() || "Show"
  const addressFromShow = formatShowAddress(show)
  const addressFromVenue =
    show.venue && show.venue.publicationStatus === PUBLICATION_STATUS_PUBLISHED
      ? formatShowAddress(venueAsAddress(show.venue))
      : ""
  const addressText = addressFromShow || addressFromVenue

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        ← next-show
      </Link>
      <article>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.date}>
          <time dateTime={show.startsAt.toISOString()}>
            {formatShowDateTime(show.startsAt)}
          </time>
        </p>
        {addressText ? (
          <p className={styles.meta}>{addressText}</p>
        ) : (
          <p className={styles.meta}>Endereço a confirmar</p>
        )}
        <a
          className={styles.ticketLink}
          href={show.ticketPurchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Comprar ingressos
        </a>

        <section aria-label="Cast">
          <h2 className={styles.sectionTitle}>Elenco</h2>
          {show.artistLinks.length === 0 ? (
            <p className={styles.meta}>Elenco a confirmar.</p>
          ) : (
            <ul className={styles.castList}>
              {show.artistLinks.map((link) => {
                const name = link.artist.displayName ?? link.artist.slug
                const isPending = link.participationStatus === "PENDING"
                const canLinkPublic =
                  link.participationStatus === "ACCEPTED" &&
                  link.artist.publicationStatus === PUBLICATION_STATUS_PUBLISHED

                return (
                  <li key={`${link.artist.slug}-${link.participationStatus}`} className={styles.castItem}>
                    {canLinkPublic ? (
                      <Link href={`/${link.artist.slug}`} className={styles.castName}>
                        {name}
                      </Link>
                    ) : (
                      <span className={styles.castNameMuted}>{name}</span>
                    )}
                    {isPending ? (
                      <span className={styles.pending}>awaiting confirmation</span>
                    ) : null}
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
