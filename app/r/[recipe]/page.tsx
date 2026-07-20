import type { Metadata } from "next"
import { buildRecipe, displayNameFromSlug } from "@/lib/recipes"
import { RecipeSetup } from "./recipe-setup"
import { Logo } from "./logo"

function VerifiedBadge() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 20 20"
      fill="none"
      aria-label="Verified"
    >
      <path
        d="M10 1.5 12.3 3l2.7-.2 1 2.5 2.3 1.4-.6 2.7.6 2.7-2.3 1.4-1 2.5-2.7-.2L10 18.5 7.7 17l-2.7.2-1-2.5-2.3-1.4.6-2.7-.6-2.7L4 6.5l1-2.5 2.7.2L10 1.5Z"
        fill="hsla(204, 88%, 52%, 1)"
      />
      <path
        d="m6.9 10.1 2.1 2.1 4.1-4.3"
        stroke="hsla(0, 0%, 100%, 1)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ recipe: string }>
}): Promise<Metadata> {
  const { recipe } = await params
  const slug = decodeURIComponent(recipe).toLowerCase()
  return { title: `${displayNameFromSlug(slug)} — Poke` }
}

export default async function RecipePage({
  params
}: {
  params: Promise<{ recipe: string }>
}) {
  const { recipe } = await params
  const slug = decodeURIComponent(recipe).toLowerCase()
  const { name, description, logoSvg, integrations } = await buildRecipe(slug)

  return (
    <main className="flex flex-1 flex-col items-center p-6 sm:justify-center sm:px-8 sm:py-10">
      <div className="flex w-full max-w-[600px] flex-1 flex-col gap-10 sm:min-h-[min(720px,88dvh)] sm:flex-initial sm:gap-12">
        <header className="flex flex-col items-center gap-4 pt-10 text-center sm:pt-14">
          <Logo
            svg={logoSvg}
            name={name}
            className="size-16 rounded-[14px] text-[1.6rem] [&_svg]:rounded-[14px] sm:size-[72px] sm:rounded-2xl sm:[&_svg]:rounded-2xl"
          />
          <h1 className="font-serif text-[34px] leading-[1.15] font-normal tracking-[-0.01em] [overflow-wrap:anywhere] sm:text-[38px]">
            {name}
          </h1>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[15px] font-medium text-muted">
            <span className="inline-flex items-center gap-[5px]">
              Made with <span aria-hidden="true">🌴</span>{" "}
              <b className="font-semibold text-foreground">Poke</b>
            </span>
            <span className="h-4 w-px bg-foreground/15" aria-hidden="true" />
            <span className="inline-flex items-center gap-[5px]">
              By <b className="font-semibold text-foreground">Poke Team</b>{" "}
              <VerifiedBadge />
            </span>
          </p>
        </header>

        <section className="flex flex-col gap-2.5">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
            Description
          </h2>
          <p className="text-base leading-[1.6] text-muted [text-wrap:pretty]">
            {description}
          </p>
        </section>

        <RecipeSetup integrations={integrations} />
      </div>
    </main>
  )
}
