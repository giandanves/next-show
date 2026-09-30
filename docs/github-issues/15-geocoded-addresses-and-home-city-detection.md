# Geocoded addresses and home city detection

## Summary
Store show locations as validated, geocoded addresses instead of free text, and detect the visitor's city on the home page ("Natal, RN", "São Paulo, SP") as groundwork for city-filtered events.

## Provider choice
OpenStreetMap-based, no API key, no billing:
- **Photon** (`photon.komoot.io`) for search-as-you-type autocomplete (Nominatim's usage policy forbids autocomplete)
- **Nominatim** (`nominatim.openstreetmap.org`) for server-side validation (`/lookup` by OSM id) and reverse geocoding (city + ISO 3166-2 state code, e.g. `BR-RN` → `RN`)

Calls go through our server (`src/lib/geo/providers.ts`) with an identifying User-Agent and 24h caching, per Nominatim policy. The provider sits behind one module so it can be swapped for Google Places or Mapbox later if quality/volume requires it.

## Scope
- `Location`: add `formattedAddress`, `latitude`, `longitude`, `geoProvider`, `geoPlaceId` (unique per provider)
- `GET /api/geo/search?q=` → address suggestions
- `GET /api/geo/reverse?lat=&lng=` → `{city, region, country, label}`
- Show create/edit: address autocomplete; client sends only the selected place reference; server re-fetches it from Nominatim and upserts the `Location` (free-text address can no longer be saved)
- Home: request geolocation on load, show city label; cache city in `localStorage` for 24h (`src/lib/geo/cityStorage.ts`) for future city-filtered events
- Coordinates rounded to ~1 km before leaving the browser

## Acceptance criteria
- [ ] Creating a show requires picking an address from the suggestions
- [ ] Saved show location has coordinates, formatted address and state code
- [ ] Editing a show without touching the address keeps the current location
- [ ] Home asks for location permission and renders e.g. "Natal, RN"
- [ ] Denied/unsupported geolocation shows a fallback message without errors

## Out of scope
- Filtering home events by city (follow-up)
- Venue CRUD address field (reuse `AddressAutocomplete` + `resolveLocationId` in #22)
- Migrating existing free-text show addresses
