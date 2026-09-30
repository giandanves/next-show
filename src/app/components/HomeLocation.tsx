"use client"

import {useEffect, useState} from "react"
import {CITY_MAX_AGE_MS, readStoredCity, storeCity} from "src/lib/geo/cityStorage"
import type {CityLocation} from "src/lib/geo/types"
import styles from "../styles/Home.module.css"

type LocationState =
  | {status: "locating"}
  | {status: "ready"; location: CityLocation}
  | {status: "unavailable"}

/** Asks for geolocation on load and shows the visitor's city, e.g. "Natal, RN". */
export function HomeLocation() {
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
          // Rounded to ~1 km: the city is all we need, so precise coordinates never leave the browser.
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

  if (state.status === "ready") {
    return (
      <p className={styles.city} aria-live="polite">
        {state.location.label}
      </p>
    )
  }

  return (
    <p className={styles.cityHint} aria-live="polite">
      {state.status === "locating"
        ? "Detectando sua cidade…"
        : "Ative a localização para ver shows perto de você."}
    </p>
  )
}
