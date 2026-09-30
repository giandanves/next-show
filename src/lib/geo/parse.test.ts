import {describe, expect, it} from "vitest"
import {
  cityFromNominatim,
  extractHouseNumber,
  isOsmRef,
  parseNominatimPlace,
  parsePhotonFeatures,
  stateCodeFromIso,
  withHouseNumber,
} from "./parse"

const nominatimBuilding = {
  osm_type: "way",
  osm_id: 1228726668,
  lat: "-5.8788667",
  lon: "-35.1748001",
  name: "Hotel Ponta Negra Beach Residence",
  display_name:
    "Hotel Ponta Negra Beach Residence, 1393, Rua Pedro Fonseca Filho, Ponta Negra, Zona Sul, Natal, Rio Grande do Norte, Região Nordeste, 59090-080, Brasil",
  address: {
    building: "Hotel Ponta Negra Beach Residence",
    house_number: "1393",
    road: "Rua Pedro Fonseca Filho",
    suburb: "Ponta Negra",
    city: "Natal",
    state: "Rio Grande do Norte",
    "ISO3166-2-lvl4": "BR-RN",
    postcode: "59090-080",
    country: "Brasil",
    country_code: "br",
  },
}

const nominatimSaoPaulo = {
  osm_type: "relation",
  osm_id: 298285,
  lat: "-23.5506507",
  lon: "-46.6333824",
  name: "São Paulo",
  address: {
    city: "São Paulo",
    state: "São Paulo",
    "ISO3166-2-lvl4": "BR-SP",
    country: "Brasil",
    country_code: "br",
  },
}

describe("stateCodeFromIso", () => {
  it("extracts the subdivision code", () => {
    expect(stateCodeFromIso("BR-RN")).toBe("RN")
    expect(stateCodeFromIso("US-CA")).toBe("CA")
  })

  it("returns null when missing", () => {
    expect(stateCodeFromIso(undefined)).toBeNull()
    expect(stateCodeFromIso("BR")).toBeNull()
  })
})

describe("isOsmRef", () => {
  it("accepts node, way and relation refs only", () => {
    expect(isOsmRef("W1228726668")).toBe(true)
    expect(isOsmRef("N1")).toBe(true)
    expect(isOsmRef("R298285")).toBe(true)
    expect(isOsmRef("X1")).toBe(false)
    expect(isOsmRef("W")).toBe(false)
    expect(isOsmRef("W1; DROP")).toBe(false)
  })
})

describe("parseNominatimPlace", () => {
  it("builds a structured Brazilian address with state code", () => {
    expect(parseNominatimPlace(nominatimBuilding)).toEqual({
      provider: "osm",
      placeId: "W1228726668",
      label: "Hotel Ponta Negra Beach Residence",
      formattedAddress:
        "Hotel Ponta Negra Beach Residence, Rua Pedro Fonseca Filho, 1393, Ponta Negra, Natal - RN",
      street: "Rua Pedro Fonseca Filho",
      houseNumber: "1393",
      addressLine1: "Rua Pedro Fonseca Filho, 1393",
      addressLine2: "Ponta Negra",
      city: "Natal",
      region: "RN",
      postalCode: "59090-080",
      country: "BR",
      latitude: -5.8788667,
      longitude: -35.1748001,
    })
  })

  it("rejects places without coordinates or OSM id", () => {
    expect(parseNominatimPlace({...nominatimBuilding, lat: "abc"})).toBeNull()
    expect(parseNominatimPlace({...nominatimBuilding, osm_type: "unknown"})).toBeNull()
  })
})

describe("cityFromNominatim", () => {
  it("labels city with state code", () => {
    expect(cityFromNominatim(nominatimBuilding)?.label).toBe("Natal, RN")
    expect(cityFromNominatim(nominatimSaoPaulo)).toEqual({
      city: "São Paulo",
      region: "SP",
      country: "BR",
      label: "São Paulo, SP",
    })
  })

  it("returns null without a city-like field", () => {
    expect(cityFromNominatim({address: {state: "Rio Grande do Norte"}})).toBeNull()
  })
})

describe("parsePhotonFeatures", () => {
  it("maps features to deduplicated suggestions", () => {
    const street = {
      properties: {
        osm_type: "W",
        osm_id: 1284941883,
        type: "street",
        name: "Avenida Praia de Ponta Negra",
        district: "Ponta Negra",
        city: "Natal",
        state: "Rio Grande do Norte",
      },
    }
    const streetSegment = {
      properties: {...street.properties, osm_id: 1284941884},
    }
    const building = {
      properties: {
        osm_type: "W",
        osm_id: 1228726668,
        type: "house",
        name: "Hotel Ponta Negra Beach Residence",
        street: "Rua Pedro Fonseca Filho",
        housenumber: "1393",
        district: "Ponta Negra",
        city: "Natal",
        state: "Rio Grande do Norte",
      },
    }

    expect(
      parsePhotonFeatures({
        features: [street, building, street, streetSegment, {properties: {}}],
      }),
    ).toEqual([
      {
        placeRef: "W1284941883",
        label: "Avenida Praia de Ponta Negra, Ponta Negra, Natal - Rio Grande do Norte",
        needsHouseNumber: true,
      },
      {
        placeRef: "W1228726668",
        label:
          "Hotel Ponta Negra Beach Residence, Rua Pedro Fonseca Filho, 1393, Ponta Negra, Natal - Rio Grande do Norte",
        needsHouseNumber: false,
      },
    ])
  })
})

describe("extractHouseNumber", () => {
  it("finds the number typed after the street", () => {
    expect(extractHouseNumber("rua exemplo, 123, natal rn")).toBe("123")
    expect(extractHouseNumber("Rua Exemplo 123A Natal")).toBe("123A")
  })

  it("ignores postal codes and text without numbers", () => {
    expect(extractHouseNumber("Rua Exemplo, 59000-000")).toBeNull()
    expect(extractHouseNumber("Rua Exemplo, Natal")).toBeNull()
  })
})

describe("withHouseNumber", () => {
  const streetOnly = parseNominatimPlace({
    osm_type: "way",
    osm_id: 1,
    lat: "-5.8",
    lon: "-35.2",
    name: "Rua Exemplo",
    address: {
      road: "Rua Exemplo",
      suburb: "Centro",
      city: "Natal",
      "ISO3166-2-lvl4": "BR-RN",
      country_code: "br",
    },
  })!

  it("adds the number to a street-only address with its own place id", () => {
    expect(withHouseNumber(streetOnly, "123")).toMatchObject({
      placeId: "W1#123",
      houseNumber: "123",
      addressLine1: "Rua Exemplo, 123",
      formattedAddress: "Rua Exemplo, 123, Centro, Natal - RN",
    })
  })

  it("keeps addresses that already have a number or no street", () => {
    const building = parseNominatimPlace(nominatimBuilding)!
    expect(withHouseNumber(building, "10")).toBe(building)
    expect(withHouseNumber(streetOnly, "  ")).toBe(streetOnly)
  })
})
