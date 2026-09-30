import {cityFromNominatim, isOsmRef, parseNominatimPlace, parsePhotonFeatures} from "./parse"
import type {NominatimPlace} from "./parse"
import type {CityLocation, PlaceSuggestion, StructuredAddress} from "./types"

const PHOTON_URL = "https://photon.komoot.io"
const NOMINATIM_URL = "https://nominatim.openstreetmap.org"

/** Rough center of Brazil: biases Photon results without excluding other countries. */
const SEARCH_BIAS = {lat: -15.78, lon: -47.93}

const DAY_SECONDS = 60 * 60 * 24

// Nominatim usage policy requires an identifying User-Agent and caching of results.
function userAgent() {
  return `next-show/1.0 (${process.env.APP_ORIGIN || "http://localhost:3000"})`
}

async function getJson<T>(url: string, revalidateSeconds: number): Promise<T> {
  const res = await fetch(url, {
    headers: {"User-Agent": userAgent(), "Accept-Language": "pt-BR"},
    next: {revalidate: revalidateSeconds},
  })
  if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`)
  return (await res.json()) as T
}

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    limit: "6",
    lat: String(SEARCH_BIAS.lat),
    lon: String(SEARCH_BIAS.lon),
  })
  const json = await getJson<Parameters<typeof parsePhotonFeatures>[0]>(
    `${PHOTON_URL}/api/?${params}`,
    DAY_SECONDS,
  )
  return parsePhotonFeatures(json)
}

export async function lookupPlace(placeRef: string): Promise<StructuredAddress | null> {
  if (!isOsmRef(placeRef)) return null
  const params = new URLSearchParams({osm_ids: placeRef, format: "jsonv2", addressdetails: "1"})
  const places = await getJson<NominatimPlace[]>(`${NOMINATIM_URL}/lookup?${params}`, DAY_SECONDS)
  const first = places[0]
  return first ? parseNominatimPlace(first) : null
}

export async function reverseCity(latitude: number, longitude: number): Promise<CityLocation | null> {
  const params = new URLSearchParams({
    // ~1 km precision is enough for a city and keeps the cache hit rate high.
    lat: latitude.toFixed(2),
    lon: longitude.toFixed(2),
    format: "jsonv2",
    addressdetails: "1",
    zoom: "10",
  })
  const place = await getJson<NominatimPlace>(`${NOMINATIM_URL}/reverse?${params}`, DAY_SECONDS)
  return cityFromNominatim(place)
}
