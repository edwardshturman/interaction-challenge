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
 * The search API's `route` URLs point at the svgl website (svgl.app), which
 * sits behind bot protection that blocks datacenter-origin fetches (e.g.
 * Vercel functions). The API host serves the same files programmatically,
 * so prefer https://api.svgl.app/svg/<file> and keep the route URL as a
 * fallback.
 */
function apiSvgUrl(routeUrl: string): string | null {
  const filename = routeUrl.split("/").pop()
  return filename ? `${SVGL_API}/svg/${filename}` : null
}

async function fetchSvg(url: string): Promise<string | null> {
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS }
  })
  if (!res.ok) {
    console.warn(`svgl: ${res.status} fetching ${url}`)
    return null
  }
  const svg = await res.text()
  if (!svg.trimStart().startsWith("<svg")) {
    console.warn(`svgl: non-SVG response from ${url}`)
    return null
  }
  return svg
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
    if (!res.ok) {
      console.warn(`svgl: ${res.status} searching for "${query}"`)
      return null
    }

    const results: SvglResult[] = await res.json()
    if (!Array.isArray(results) || results.length === 0) return null

    const match =
      results.find((r) => r.title.toLowerCase() === query) ?? results[0]

    const routeUrl =
      typeof match.route === "string" ? match.route : match.route.light

    const apiUrl = apiSvgUrl(routeUrl)
    const svg =
      (apiUrl ? await fetchSvg(apiUrl) : null) ?? (await fetchSvg(routeUrl))
    if (!svg) return null

    return { title: match.title, svg }
  } catch (error) {
    console.warn(`svgl: failed to resolve logo for "${query}"`, error)
    return null
  }
}
