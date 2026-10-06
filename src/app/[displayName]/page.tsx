import Link from "next/link"
import {notFound} from "next/navigation"
import {fetchArtistBySlug} from "../artists/artistPublicData"
import {
  formatShowAddress,
  formatShowDateTime,
  parseSocialLinks,
  platformLabel,
} from "src/lib/showFormatting"

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
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-8">
      <article>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-neutral-900">{heading}</h1>

        {social ? (
          <section aria-label="Social links">
            <h2 className="mt-7 mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">
              Redes
            </h2>
            <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-3 p-0">
              {Object.entries(social).map(([platform, url]) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {platformLabel(platform)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-label="Shows">
          <h2 className="mt-7 mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Shows
          </h2>
          {artist.showLinks.length === 0 ? (
            <p className="m-0 text-[0.9375rem] leading-snug text-neutral-700">
              Nenhum show cadastrado.
            </p>
          ) : (
            <ul className="m-0 list-none p-0">
              {artist.showLinks.map(({show}) => {
                const addressText = formatShowAddress(show)
                const title = show.title?.trim() || "Show"
                return (
                  <li key={show.id} className="border-b border-neutral-200 py-4 last:border-b-0">
                    <h3 className="mb-1.5 font-semibold text-neutral-900">
                      <Link href={`/shows/${show.id}`} className="hover:text-primary hover:underline">
                        {title}
                      </Link>
                    </h3>
                    <p className="mb-2 text-[0.9375rem] font-medium text-neutral-900">
                      <time dateTime={show.startsAt.toISOString()}>
                        {formatShowDateTime(show.startsAt)}
                      </time>
                    </p>
                    <p className="m-0 text-[0.9375rem] leading-snug text-neutral-700">
                      {addressText || "Endereço a confirmar"}
                    </p>
                    <a
                      className="mt-2 inline-block font-medium text-primary underline"
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
