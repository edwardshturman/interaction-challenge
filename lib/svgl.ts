const SVGL_API = "https://api.svgl.app"

// Cache svgl responses for an hour — the API is rate-limited and its docs
// ask consumers to cache instead of re-requesting on every call.
const REVALIDATE_SECONDS = 3600

type ThemeOptions = {
  dark: string
  light: string
}

export interface SvglResult {
  id: number
  title: string
  category: string | string[]
  route: string | ThemeOptions
  url: string
  wordmark?: string | ThemeOptions
  brandUrl?: string
}

export interface RecipeLogo {
  /** Canonical product name as listed on svgl, e.g. "Notion" */
  title: string
  /** Inline SVG markup for the logo */
  svg: string
}

/**
 * Search svgl for a logo matching the recipe slug and return its inline SVG
 * markup. Returns null when no logo is found or the API is unavailable.
 */
export async function getRecipeLogo(slug: string): Promise<RecipeLogo | null> {
  const query = slug.trim().toLowerCase()
  if (!query) return null

  try {
    const res = await fetch(`${SVGL_API}?search=${encodeURIComponent(query)}`, {
      next: { revalidate: REVALIDATE_SECONDS }
    })
    if (!res.ok) return null

    const results: SvglResult[] = await res.json()
    if (!Array.isArray(results) || results.length === 0) return null

    const match =
      results.find((r) => r.title.toLowerCase() === query) ?? results[0]

    const routeUrl =
      typeof match.route === "string" ? match.route : match.route.light

    const svgRes = await fetch(routeUrl, {
      next: { revalidate: REVALIDATE_SECONDS }
    })
    if (!svgRes.ok) return null

    const svg = await svgRes.text()
    if (!svg.trimStart().startsWith("<svg")) return null

    return { title: match.title, svg }
  } catch {
    return null
  }
}
