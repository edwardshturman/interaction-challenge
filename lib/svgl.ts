const SVGL_API = "https://api.svgl.app"

// svgl asks consumers to cache API responses instead of re-requesting per
// call. We fetch the full catalog once, cache it for an hour (Next data
// cache, shared across requests on Vercel), and match slugs in-process —
// so upstream sees one catalog request per hour plus one cached request
// per SVG file, no matter the traffic.
const REVALIDATE_SECONDS = 3600

// Identify ourselves honestly; anonymous datacenter traffic is what
// rate limiters and WAFs are tuned to reject
const REQUEST_HEADERS = {
  "User-Agent": "poke-recipe-prototype/0.1 (interaction design demo)"
}

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

async function getCatalog(): Promise<SvglResult[] | null> {
  try {
    const res = await fetch(SVGL_API, {
      headers: REQUEST_HEADERS,
      next: { revalidate: REVALIDATE_SECONDS }
    })
    if (!res.ok) {
      console.warn(`svgl: ${res.status} fetching catalog`)
      return null
    }
    const results: SvglResult[] = await res.json()
    return Array.isArray(results) ? results : null
  } catch (error) {
    console.warn("svgl: failed to fetch catalog", error)
    return null
  }
}

function findEntry(catalog: SvglResult[], query: string): SvglResult | null {
  return (
    catalog.find((s) => s.title.toLowerCase() === query) ??
    catalog.find((s) => s.title.toLowerCase().startsWith(query)) ??
    catalog.find((s) => s.title.toLowerCase().includes(query)) ??
    null
  )
}

/**
 * SVG contents are served from the API host ("Get the SVG code" endpoint);
 * the catalog's route URLs point at the svgl website, which sits behind
 * bot protection that can block server-origin fetches. Keep the route URL
 * as a fallback.
 */
function apiSvgUrl(routeUrl: string): string | null {
  const filename = routeUrl.split("/").pop()
  return filename ? `${SVGL_API}/svg/${filename}` : null
}

async function fetchSvg(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: REQUEST_HEADERS,
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
  } catch (error) {
    console.warn(`svgl: failed to fetch ${url}`, error)
    return null
  }
}

/**
 * Look up a logo in the cached svgl catalog and return its inline SVG
 * markup. Returns null when no logo is found or the API is unavailable.
 */
export async function getRecipeLogo(slug: string): Promise<RecipeLogo | null> {
  const query = slug.trim().toLowerCase()
  if (!query) return null

  const catalog = await getCatalog()
  if (!catalog) return null

  const match = findEntry(catalog, query)
  if (!match) return null

  const routeUrl =
    typeof match.route === "string" ? match.route : match.route.light

  const apiUrl = apiSvgUrl(routeUrl)
  const svg =
    (apiUrl ? await fetchSvg(apiUrl) : null) ?? (await fetchSvg(routeUrl))
  if (!svg) return null

  return { title: match.title, svg }
}
