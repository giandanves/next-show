import type {CityLocation, PlaceSuggestion, StructuredAddress} from "./types"

const OSM_REF = /^[NWR]\d+$/

const OSM_TYPE_PREFIX: Record<string, string> = {node: "N", way: "W", relation: "R"}

export function isOsmRef(value: string): boolean {
  return OSM_REF.test(value)
}

/** "BR-RN" -> "RN" */
export function stateCodeFromIso(iso: string | null | undefined): string | null {
  const code = iso?.split("-")[1]?.trim()
  return code ? code.toUpperCase() : null
}

function compact(parts: (string | null | undefined)[]): string[] {
  return parts.flatMap((part) => {
    const value = part?.trim()
    return value ? [value] : []
  })
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index)
}

function streetLine(street?: string, houseNumber?: string): string | null {
  if (!street) return null
  return compact([street, houseNumber]).join(", ")
}

type NominatimAddress = Record<string, string | undefined>

export type NominatimPlace = {
  osm_type?: string
  osm_id?: number
  lat?: string
  lon?: string
  name?: string
  display_name?: string
  address?: NominatimAddress
}

function pickCity(address: NominatimAddress): string | null {
  return address.city ?? address.town ?? address.village ?? address.municipality ?? null
}

function pickRegion(address: NominatimAddress): string | null {
  return stateCodeFromIso(address["ISO3166-2-lvl4"]) ?? address.state ?? null
}

function formatAddress(
  parts: Pick<StructuredAddress, "label" | "addressLine1" | "addressLine2" | "city" | "region">,
): string {
  return compact([
    parts.label,
    parts.addressLine1,
    parts.addressLine2,
    compact([parts.city, parts.region]).join(" - "),
  ]).join(", ")
}

export function parseNominatimPlace(place: NominatimPlace): StructuredAddress | null {
  const prefix = place.osm_type ? OSM_TYPE_PREFIX[place.osm_type] : undefined
  const latitude = Number(place.lat)
  const longitude = Number(place.lon)
  if (!prefix || !place.osm_id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const address = place.address ?? {}
  const name = place.name?.trim()
  const parts = {
    label: name && name !== address.road ? name : null,
    addressLine1: streetLine(address.road, address.house_number),
    addressLine2: address.suburb ?? null,
    city: pickCity(address),
    region: pickRegion(address),
  }

  return {
    provider: "osm",
    placeId: `${prefix}${place.osm_id}`,
    ...parts,
    street: address.road ?? null,
    houseNumber: address.house_number ?? null,
    formattedAddress: formatAddress(parts) || place.display_name || "",
    postalCode: address.postcode ?? null,
    country: address.country_code?.toUpperCase() ?? null,
    latitude,
    longitude,
  }
}

/**
 * OSM rarely maps Brazilian house numbers, so a street match loses the number the user typed.
 * Applies it to street-only matches; the place id gets the number so each address is its own Location.
 */
export function withHouseNumber(
  address: StructuredAddress,
  houseNumber: string | null | undefined,
): StructuredAddress {
  const number = houseNumber?.trim()
  if (!number || address.houseNumber || !address.street) return address

  const addressLine1 = streetLine(address.street, number)
  return {
    ...address,
    placeId: `${address.placeId}#${number}`,
    houseNumber: number,
    addressLine1,
    formattedAddress: formatAddress({...address, addressLine1}),
  }
}

/** First standalone house number in free text, e.g. "Rua Exemplo, 123, Natal" -> "123". Ignores CEPs. */
export function extractHouseNumber(text: string): string | null {
  const withoutPostalCodes = text.replace(/\b\d{5}-?\d{3}\b/g, " ")
  return withoutPostalCodes.match(/(?:^|[\s,])(\d{1,5}[A-Za-z]?)(?=$|[\s,])/)?.[1] ?? null
}

export function cityFromNominatim(place: NominatimPlace): CityLocation | null {
  const address = place.address ?? {}
  const city = pickCity(address)
  if (!city) return null
  const region = pickRegion(address)
  return {
    city,
    region,
    country: address.country_code?.toUpperCase() ?? null,
    label: region ? `${city}, ${region}` : city,
  }
}

type PhotonFeature = {
  properties?: {
    osm_type?: string
    osm_id?: number
    type?: string
    name?: string
    street?: string
    housenumber?: string
    district?: string
    city?: string
    state?: string
  }
}

export function parsePhotonFeatures(json: {features?: PhotonFeature[]}): PlaceSuggestion[] {
  // A street is often split into several OSM ways with the same label; keep only the first.
  const seenRefs = new Set<string>()
  const seenLabels = new Set<string>()
  return (json.features ?? []).flatMap((feature) => {
    const p = feature.properties
    if (!p?.osm_type || !p.osm_id) return []
    const placeRef = `${p.osm_type}${p.osm_id}`
    if (!isOsmRef(placeRef) || seenRefs.has(placeRef)) return []
    seenRefs.add(placeRef)

    const label = unique(
      compact([
        p.name,
        streetLine(p.street, p.housenumber),
        p.district,
        compact([p.city, p.state]).join(" - "),
      ]),
    ).join(", ")
    if (!label || seenLabels.has(label)) return []
    seenLabels.add(label)

    return [{placeRef, label, needsHouseNumber: p.type === "street" && !p.housenumber}]
  })
}
