/** Address validated by a geocoder, ready to persist on `Location`. */
export type StructuredAddress = {
  provider: "osm"
  /** OSM reference: N (node), W (way) or R (relation) + id, e.g. "W1228726668". */
  placeId: string
  /** Place name when it differs from the street, e.g. a venue or building. */
  label: string | null
  formattedAddress: string
  street: string | null
  houseNumber: string | null
  /** Street + number, e.g. "Rua Pedro Fonseca Filho, 1393". */
  addressLine1: string | null
  /** Neighborhood, e.g. "Ponta Negra". */
  addressLine2: string | null
  city: string | null
  /** State code when available (ISO 3166-2 subdivision), e.g. "RN". */
  region: string | null
  postalCode: string | null
  /** ISO 3166-1 alpha-2, e.g. "BR". */
  country: string | null
  latitude: number
  longitude: number
}

export type PlaceSuggestion = {
  placeRef: string
  label: string
  /** Street match without a mapped house number: the user must type it. */
  needsHouseNumber: boolean
}

export type CityLocation = {
  city: string
  region: string | null
  country: string | null
  /** Display label, e.g. "Natal, RN". */
  label: string
}
