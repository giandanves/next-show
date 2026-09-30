import db from "db"
import {withHouseNumber} from "./parse"
import {lookupPlace} from "./providers"

/** Validates a place reference with the geocoder and returns the matching `Location` id. */
export async function resolveLocationId(placeRef: string, houseNumber?: string): Promise<number> {
  const found = await lookupPlace(placeRef)
  if (!found) throw new Error("Address not found. Pick an address from the suggestions.")
  const address = withHouseNumber(found, houseNumber)

  const data = {
    label: address.label,
    formattedAddress: address.formattedAddress,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    country: address.country,
    latitude: address.latitude,
    longitude: address.longitude,
  }

  const location = await db.location.upsert({
    where: {
      geoProvider_geoPlaceId: {geoProvider: address.provider, geoPlaceId: address.placeId},
    },
    update: data,
    create: {...data, geoProvider: address.provider, geoPlaceId: address.placeId},
    select: {id: true},
  })
  return location.id
}
