"use client"

import {useEffect, useState} from "react"
import {CITY_MAX_AGE_MS, readStoredCity, storeCity} from "src/lib/geo/cityStorage"
import type {CityLocation} from "src/lib/geo/types"

export type LocationState =
  | {status: "locating"}
  | {status: "ready"; location: CityLocation}
  | {status: "unavailable"}

/** Visitor city from geolocation + reverse geocode (cached 24h in localStorage). */
export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({status: "locating"})

  useEffect(() => {
    const stored = readStoredCity()
    if (stored) {
      setState({status: "ready", location: stored})
      return
    }
    if (!("geolocation" in navigator)) {
      setState({status: "unavailable"})
      return
    }

    let cancelled = false
    navigator.geolocation.getCurrentPosition(
      async ({coords}) => {
        try {
          const params = new URLSearchParams({
            lat: coords.latitude.toFixed(2),
            lng: coords.longitude.toFixed(2),
          })
          const res = await fetch(`/api/geo/reverse?${params}`)
          if (!res.ok) throw new Error(`Reverse geocoding failed (${res.status})`)
          const {location} = (await res.json()) as {location: CityLocation}
          storeCity(location)
          if (!cancelled) setState({status: "ready", location})
        } catch {
          if (!cancelled) setState({status: "unavailable"})
        }
      },
      () => {
        if (!cancelled) setState({status: "unavailable"})
      },
      {enableHighAccuracy: false, timeout: 10_000, maximumAge: CITY_MAX_AGE_MS},
    )

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
