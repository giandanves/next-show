import Link from "next/link"
import {notFound} from "next/navigation"
import {fetchShowById} from "../showPublicData"
import {formatShowAddress, formatShowDateTime} from "src/lib/showFormatting"
import {PUBLICATION_STATUS_PUBLISHED} from "src/lib/publicationStatus"

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
    <div className="mx-auto max-w-2xl px-5 pb-16 pt-8">
      <Link href="/" className="mb-5 inline-block text-sm text-primary underline">
        ← next-show
      </Link>
      <article>
        <h1 className="mb-2 text-3xl font-bold leading-tight text-neutral-900">{title}</h1>
        <p className="mb-3 text-base font-medium text-neutral-900">
          <time dateTime={show.startsAt.toISOString()}>{formatShowDateTime(show.startsAt)}</time>
        </p>
        <p className="m-0 text-[0.9375rem] leading-snug text-neutral-700">
          {addressText || "Endereço a confirmar"}
        </p>
        <a
          className="mt-3 inline-block font-medium text-primary underline"
          href={show.ticketPurchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Comprar ingressos
        </a>

        <section aria-label="Cast">
          <h2 className="mt-7 mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Elenco
          </h2>
          {show.artistLinks.length === 0 ? (
            <p className="m-0 text-[0.9375rem] leading-snug text-neutral-700">Elenco a confirmar.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {show.artistLinks.map((link) => {
                const name = link.artist.displayName ?? link.artist.slug
                const isPending = link.participationStatus === "PENDING"
                const canLinkPublic =
                  link.participationStatus === "ACCEPTED" &&
                  link.artist.publicationStatus === PUBLICATION_STATUS_PUBLISHED

                return (
                  <li
                    key={`${link.artist.slug}-${link.participationStatus}`}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-neutral-200 py-2.5 last:border-b-0"
                  >
                    {canLinkPublic ? (
                      <Link
                        href={`/${link.artist.slug}`}
                        className="font-semibold text-neutral-900 hover:underline"
                      >
                        {name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-neutral-900">{name}</span>
                    )}
                    {isPending ? (
                      <span className="text-[0.8125rem] italic text-neutral-500">
                        awaiting confirmation
                      </span>
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
