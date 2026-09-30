import type {CityLocation} from "./types"

const STORAGE_KEY = "next-show:city"
export const CITY_MAX_AGE_MS = 24 * 60 * 60 * 1000

type StoredCity = {savedAt: number; location: CityLocation}

/** Last detected city (browser only). Used by the home and, later, city-filtered events. */
export function readStoredCity(): CityLocation | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw) as StoredCity
    if (Date.now() - stored.savedAt > CITY_MAX_AGE_MS) return null
    return stored.location
  } catch {
    return null
  }
}

export function storeCity(location: CityLocation) {
  try {
    const stored: StoredCity = {savedAt: Date.now(), location}
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage can be unavailable (private mode); detection still works per visit.
  }
}
