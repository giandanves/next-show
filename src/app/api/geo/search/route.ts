import {NextRequest, NextResponse} from "next/server"
import {searchPlaces} from "src/lib/geo/providers"

/** Address autocomplete: GET /api/geo/search?q=... */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (query.length < 3) return NextResponse.json({suggestions: []})

  try {
    const suggestions = await searchPlaces(query.slice(0, 200))
    return NextResponse.json({suggestions})
  } catch {
    return NextResponse.json({error: "Geocoding unavailable"}, {status: 502})
  }
}
