import type { Metadata } from "next"
import { getRecipeLogo } from "@/lib/svgl"

interface RecipeCopy {
  description: string
  integration: string
}

const RECIPE_COPY: Record<string, RecipeCopy> = {
  notion: {
    description:
      "Access and organize your pages, databases, and docs from your texts. Build reports, plan projects, organize databases, and search your entire workspace from your texts.",
    integration: "Read and write pages and databases"
  }
}

function displayNameFromSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function copyFor(slug: string, name: string): RecipeCopy {
  return (
    RECIPE_COPY[slug] ?? {
      description: `Connect ${name} to Poke and use it straight from your texts. Ask questions, take actions, and stay on top of everything without leaving your messages.`,
      integration: `Read and write your ${name} data`
    }
  )
}

function Logo({
  svg,
  name,
  className
}: {
  svg: string | undefined
  name: string
  className: string
}) {
  if (svg) {
    return (
      <span
        className={`block [&_svg]:block [&_svg]:size-full ${className}`}
        role="img"
        aria-label={`${name} logo`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }
  return (
    <span
      className={`flex items-center justify-center border border-border-soft bg-card font-bold text-foreground shadow-soft ${className}`}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  )
}

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
  return { title: `${displayNameFromSlug(slug)} · Poke` }
}

export default async function RecipePage({
  params
}: {
  params: Promise<{ recipe: string }>
}) {
  const { recipe } = await params
  const slug = decodeURIComponent(recipe).toLowerCase()

  const logo = await getRecipeLogo(slug)
  const name = logo?.title ?? displayNameFromSlug(slug)
  const copy = copyFor(slug, name)

  return (
    <main className="flex flex-1 flex-col items-center p-6 sm:justify-center sm:px-8 sm:py-10">
      <div className="flex w-full max-w-[600px] flex-1 flex-col gap-10 sm:min-h-[min(720px,88dvh)] sm:flex-initial sm:gap-12">
        <header className="flex flex-col items-center gap-4 pt-10 text-center sm:pt-14">
          <Logo
            svg={logo?.svg}
            name={name}
            className="size-16 rounded-[14px] text-[1.6rem] [&_svg]:rounded-[14px] sm:size-[72px] sm:rounded-2xl sm:[&_svg]:rounded-2xl"
          />
          <h1 className="font-serif text-[34px] font-normal leading-[1.15] tracking-[-0.01em] [overflow-wrap:anywhere] sm:text-[38px]">
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
            {copy.description}
          </p>
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
            Integrations
          </h2>
          <div className="flex items-center gap-3 rounded-[18px] border border-border-soft bg-card px-4 py-3.5 shadow-soft">
            <Logo
              svg={logo?.svg}
              name={name}
              className="size-10 shrink-0 rounded-[9px] text-base [&_svg]:rounded-[9px]"
            />
            <div className="mr-auto flex min-w-0 flex-col gap-0.5">
              <span className="text-base font-semibold tracking-[-0.01em]">
                {name}
              </span>
              <span className="text-[13px] leading-[1.4] text-muted">
                {copy.integration}
              </span>
            </div>
            <a
              href="#"
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-foreground/[0.06] hover:text-muted"
              aria-label={`More options for ${name}`}
            >
              <svg
                className="h-1 w-4"
                viewBox="0 0 16 4"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="2" cy="2" r="1.5" />
                <circle cx="8" cy="2" r="1.5" />
                <circle cx="14" cy="2" r="1.5" />
              </svg>
            </a>
            <a
              href="#"
              className="shrink-0 rounded-full border border-border-soft bg-card px-[18px] py-[9px] text-[15px] font-semibold tracking-[-0.01em] shadow-[0_1px_2px_hsla(48,8%,12%,0.08)] transition hover:bg-[hsla(43,30%,95%,1)] active:scale-[0.97]"
            >
              Connect
            </a>
          </div>
        </section>

        <div className="mt-auto flex flex-col items-center gap-5 pb-2">
          <a
            href="#"
            className="flex min-h-14 w-full items-center justify-center rounded-[18px] bg-[hsla(45,8%,10%,1)] text-[17px] font-semibold tracking-[-0.01em] text-white shadow-[0_6px_16px_hsla(48,8%,12%,0.22),inset_0_1px_0_hsla(0,0%,100%,0.12)] transition hover:shadow-[0_8px_20px_hsla(48,8%,12%,0.28),inset_0_1px_0_hsla(0,0%,100%,0.12)] active:scale-[0.98]"
          >
            Get Started
          </a>
          <nav
            className="flex items-center gap-2.5 text-sm font-medium text-faint"
            aria-label="Footer"
          >
            <a href="#" className="transition-colors hover:text-muted">
              Use Cases
            </a>
            <span className="select-none" aria-hidden="true">
              ·
            </span>
            <a href="#" className="transition-colors hover:text-muted">
              poke.com
            </a>
          </nav>
        </div>
      </div>
    </main>
  )
}
