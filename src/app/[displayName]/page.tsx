import {notFound} from "next/navigation"
import {fetchArtistBySlug} from "../artists/artistPublicData"
import {
  formatShowAddress,
  formatShowDateTime,
  parseSocialLinks,
  platformLabel,
} from "src/lib/showFormatting"
import styles from "./ArtistProfile.module.css"

export default async function ArtistPublicPage({
  params,
}: {
  params: Promise<{displayName: string}>
}) {
  const {displayName} = await params
  const artist = await fetchArtistBySlug(displayName)
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
                      <time dateTime={show.startsAt.toISOString()}>
                        {formatShowDateTime(show.startsAt)}
                      </time>
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
