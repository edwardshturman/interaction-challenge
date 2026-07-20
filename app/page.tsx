import Link from "next/link"

const EXAMPLES = [
  {
    href: "/r/notion",
    slug: "/r/notion",
    note: "one required integration"
  },
  {
    href: "/r/spotify",
    slug: "/r/spotify",
    note: "one required, one optional integration"
  }
]

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-[600px] flex-col gap-5">
        <h1 className="font-serif text-[34px] leading-[1.15] font-normal tracking-[-0.01em]">
          Recipe install screens
        </h1>
        <ul className="flex list-disc flex-col gap-2.5 pl-5 text-base leading-[1.6] text-muted marker:text-faint">
          {EXAMPLES.map((example) => (
            <li key={example.href}>
              <Link
                href={example.href}
                className="font-semibold text-foreground underline decoration-faint underline-offset-4 transition-colors hover:decoration-foreground"
              >
                {example.slug}
              </Link>
              : {example.note}
            </li>
          ))}
        </ul>
        <p className="text-base text-muted">
          These are just examples, replace with any value in the URL :)
        </p>
      </div>
    </main>
  )
}
