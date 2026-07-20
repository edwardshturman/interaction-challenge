import { getRecipeLogo } from "@/lib/svgl"

export interface Provider {
  id: string
  name: string
  logoSvg?: string
}

export interface Integration {
  id: string
  name: string
  description: string
  /** The Recipe cannot be enabled until every required integration is connected */
  required: boolean
  connected: boolean
  logoSvg?: string
  /**
   * Present on generic integrations: the category (e.g. email) is what's
   * required, and the user connects any one of these whitelisted providers.
   */
  providers?: Provider[]
  /** Which provider the user connected, for generic integrations */
  connectedProviderId?: string
}

export interface Recipe {
  slug: string
  name: string
  description: string
  logoSvg?: string
  integrations: Integration[]
}

interface ProviderSpec {
  id: string
  name: string
  /** svgl search term when the provider's display name doesn't match */
  logoQuery?: string
}

interface CategorySpec {
  id: string
  name: string
  description: string
  providers: ProviderSpec[]
}

interface DemoRecipeSpec {
  name: string
  description: string
  categories: CategorySpec[]
}

/** Hand-built demo Recipes showcasing generic (category) integrations */
const DEMO_RECIPES: Record<string, DemoRecipeSpec> = {
  "sleep-brief": {
    name: "Sleep Brief",
    description:
      "Wake up to a daily email brief of your health results from the night's sleep. Recovery, readiness, and trends, delivered before you start your day.",
    categories: [
      {
        id: "health",
        name: "Health",
        description: "Choose where your sleep data comes from",
        providers: [
          { id: "oura", name: "Oura Ring" },
          { id: "apple-health", name: "Apple Health", logoQuery: "apple" }
        ]
      },
      {
        id: "email",
        name: "Email",
        description: "Choose where your daily brief is delivered",
        providers: [
          { id: "gmail", name: "Gmail" },
          { id: "outlook", name: "Outlook", logoQuery: "microsoft outlook" }
        ]
      }
    ]
  }
}

export function displayNameFromSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

async function buildDemoRecipe(
  slug: string,
  spec: DemoRecipeSpec
): Promise<Recipe> {
  const integrations = await Promise.all(
    spec.categories.map(async (category): Promise<Integration> => {
      const providers = await Promise.all(
        category.providers.map(async (provider): Promise<Provider> => {
          const logo = await getRecipeLogo(provider.logoQuery ?? provider.name)
          return { id: provider.id, name: provider.name, logoSvg: logo?.svg }
        })
      )
      return {
        id: category.id,
        name: category.name,
        description: category.description,
        required: true,
        connected: false,
        providers
      }
    })
  )

  return {
    slug,
    name: spec.name,
    description: spec.description,
    integrations
  }
}

/**
 * Assemble the full Recipe for a slug, resolving logos from svgl.
 * Demo slugs come from DEMO_RECIPES; every other Recipe gets a required,
 * unconnected integration for the app itself, plus an optional Notion
 * integration for demo purposes (skipped on r/notion where it would
 * duplicate the primary one).
 */
export async function buildRecipe(slug: string): Promise<Recipe> {
  const demo = DEMO_RECIPES[slug]
  if (demo) return buildDemoRecipe(slug, demo)

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
