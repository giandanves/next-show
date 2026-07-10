export type ShowForAddress = {
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  region: string | null
  postalCode: string | null
  country: string | null
  location: {
    label: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    region: string | null
    postalCode: string | null
    country: string | null
  } | null
}

function compactParts(...parts: (string | null | undefined)[]): string[] {
  return parts.flatMap((p) => {
    const s = p?.trim()
    return s ? [s] : []
  })
}

export function formatShowAddress(show: ShowForAddress): string {
  const loc = show.location
  if (loc) {
    const cityRegion = [loc.city, loc.region].filter(Boolean).join(", ")
    return compactParts(
      loc.label,
      loc.addressLine1,
      loc.addressLine2,
      cityRegion || undefined,
      loc.postalCode,
      loc.country,
    ).join(" · ")
  }
  const cityRegion = [show.city, show.region].filter(Boolean).join(", ")
  return compactParts(
    show.addressLine1,
    show.addressLine2,
    cityRegion || undefined,
    show.postalCode,
    show.country,
  ).join(" · ")
}

export function formatShowDateTime(startsAt: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(startsAt)
}

export function parseSocialLinks(raw: string | null): Record<string, string> | null {
  if (!raw?.trim()) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null
    const out: Record<string, string> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) out[key] = value.trim()
    }
    return Object.keys(out).length ? out : null
  } catch {
    return null
  }
}

export function platformLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
