import {NextRequest, NextResponse} from "next/server"
import {reverseCity} from "src/lib/geo/providers"

/** City for the visitor's coordinates: GET /api/geo/reverse?lat=...&lng=... */
export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"))
  const longitude = Number(request.nextUrl.searchParams.get("lng"))
  const valid =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  if (!valid) return NextResponse.json({error: "Invalid coordinates"}, {status: 400})

  try {
    const location = await reverseCity(latitude, longitude)
    if (!location) return NextResponse.json({error: "City not found"}, {status: 404})
    return NextResponse.json({location})
  } catch {
    return NextResponse.json({error: "Geocoding unavailable"}, {status: 502})
  }
}
