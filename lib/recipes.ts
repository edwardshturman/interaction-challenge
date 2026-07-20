import { getRecipeLogo } from "@/lib/svgl"

export interface Integration {
  id: string
  name: string
  description: string
  /** The Recipe cannot be enabled until every required integration is connected */
  required: boolean
  connected: boolean
  logoSvg?: string
}

export interface Recipe {
  slug: string
  name: string
  description: string
  logoSvg?: string
  integrations: Integration[]
}

export function displayNameFromSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/**
 * Assemble the full Recipe for a slug, resolving its logo from svgl.
 * Every Recipe gets a required, unconnected integration for the app itself,
 * plus an optional Notion integration for demo purposes (skipped on r/notion
 * where it would duplicate the primary one).
 */
export async function buildRecipe(slug: string): Promise<Recipe> {
  // Fetched in parallel; on r/notion these are the same memoized request
  const [logo, notionLogo] = await Promise.all([
    getRecipeLogo(slug),
    getRecipeLogo("notion")
  ])
  const name = logo?.title ?? displayNameFromSlug(slug)

  const integrations: Integration[] = [
    {
      id: slug,
      name,
      description: `Read and write your ${name} data`,
      required: true,
      connected: false,
      logoSvg: logo?.svg
    }
  ]

  if (slug !== "notion") {
    integrations.push({
      id: "notion",
      name: "Notion",
      description: "Read and write your Notion data",
      required: false,
      connected: false,
      logoSvg: notionLogo?.svg
    })
  }

  return {
    slug,
    name,
    description: `Connect ${name} to Poke and use it straight from your texts. Ask questions, take actions, and stay on top of everything without leaving your messages.`,
    logoSvg: logo?.svg,
    integrations
  }
}
