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
 * For now, every Recipe has a single required, unconnected integration for
 * the app itself; the shape supports multiple, mixed required/optional ones.
 */
export async function buildRecipe(slug: string): Promise<Recipe> {
  const logo = await getRecipeLogo(slug)
  const name = logo?.title ?? displayNameFromSlug(slug)

  return {
    slug,
    name,
    description: `Connect ${name} to Poke and use it straight from your texts. Ask questions, take actions, and stay on top of everything without leaving your messages.`,
    logoSvg: logo?.svg,
    integrations: [
      {
        id: slug,
        name,
        description: `Read and write your ${name} data`,
        required: true,
        connected: false,
        logoSvg: logo?.svg
      }
    ]
  }
}
