"use client"

import Link from "next/link"
import { useState } from "react"
import { Copy, Flag, HeartPulse, Mail, Plus, Puzzle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Integration, Provider } from "@/lib/recipes"
import { DebugPanel } from "./debug-panel"
import { Logo } from "./logo"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  email: Mail,
  health: HeartPulse
}

function Tooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {label}
    </span>
  )
}

function IconAction({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="group relative flex size-14 shrink-0 items-center justify-center rounded-[18px] border border-border-soft bg-card text-muted shadow-[0_1px_2px_hsla(48,8%,12%,0.08)] transition hover:bg-[hsla(43,30%,95%,1)] hover:text-foreground active:scale-[0.97]"
    >
      {children}
      <Tooltip label={label} />
    </Link>
  )
}

function ProviderPicker({
  integration,
  onSelect
}: {
  integration: Integration
  onSelect: (provider: Provider) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative shrink-0"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      {open && (
        <button
          type="button"
          aria-label="Close provider menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-10 cursor-default"
        />
      )}
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Choose a provider for ${integration.name}`}
        onClick={() => setOpen(!open)}
        className="flex size-10 cursor-pointer items-center justify-center rounded-[12px] border border-dashed border-foreground/25 text-muted transition hover:border-foreground/45 hover:bg-foreground/[0.03] hover:text-foreground active:scale-[0.97]"
      >
        <Plus className="size-5" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={`${integration.name} providers`}
          className="absolute right-0 bottom-[calc(100%+8px)] z-20 flex gap-1.5 rounded-[14px] border border-border-soft bg-card p-1.5 shadow-[0_8px_24px_hsla(48,8%,12%,0.14)]"
        >
          {integration.providers?.map((provider) => (
            <button
              key={provider.id}
              type="button"
              role="menuitem"
              aria-label={`Connect ${provider.name}`}
              onClick={() => {
                onSelect(provider)
                setOpen(false)
              }}
              className="group relative flex size-11 cursor-pointer items-center justify-center rounded-[10px] transition hover:bg-foreground/[0.05] active:scale-[0.95]"
            >
              <Logo
                svg={provider.logoSvg}
                name={provider.name}
                className="size-6 rounded-[6px] text-xs"
              />
              <Tooltip label={provider.name} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function IntegrationCard({
  integration,
  onPatch
}: {
  integration: Integration
  onPatch: (patch: Partial<Integration>) => void
}) {
  const isGeneric = integration.providers !== undefined
  const CategoryIcon = CATEGORY_ICONS[integration.id] ?? Puzzle
  const connectedProvider = integration.providers?.find(
    (provider) => provider.id === integration.connectedProviderId
  )

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-border-soft bg-card px-4 py-3.5 shadow-soft">
      {isGeneric ? (
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-[9px] border border-foreground/20 text-muted"
          aria-hidden="true"
        >
          <CategoryIcon className="size-5" />
        </span>
      ) : (
        <Logo
          svg={integration.logoSvg}
          name={integration.name}
          className="size-10 shrink-0 rounded-[9px] text-base [&_svg]:rounded-[9px]"
        />
      )}
      <div className="mr-auto flex min-w-0 flex-col gap-0.5">
        <span className="flex items-center gap-2 text-base font-semibold tracking-[-0.01em]">
          {integration.name}
          {integration.required ? (
            <span className="rounded-full bg-[hsla(35,90%,55%,0.16)] px-2 py-0.5 text-[11px] font-semibold text-[hsla(30,65%,36%,1)]">
              Required
            </span>
          ) : (
            <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-semibold text-muted">
              Optional
            </span>
          )}
        </span>
        <span className="text-[13px] leading-[1.4] text-muted">
          {integration.description}
        </span>
      </div>
      <Link
        href="#"
        className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-faint transition-colors hover:bg-foreground/[0.06] hover:text-muted"
        aria-label={`More options for ${integration.name}`}
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
      </Link>
      {isGeneric && !integration.connected && (
        <ProviderPicker
          integration={integration}
          onSelect={(provider) =>
            onPatch({ connected: true, connectedProviderId: provider.id })
          }
        />
      )}
      {isGeneric && integration.connected && (
        <button
          type="button"
          aria-pressed
          onClick={() =>
            onPatch({ connected: false, connectedProviderId: undefined })
          }
          className="shrink-0 cursor-pointer rounded-[12px] border border-[hsla(145,45%,45%,0.35)] bg-[hsla(145,55%,96%,1)] px-[18px] py-[9px] text-[15px] font-semibold tracking-[-0.01em] text-[hsla(150,55%,28%,1)] transition hover:bg-[hsla(145,50%,93%,1)] active:scale-[0.97]"
        >
          <span className="flex items-center gap-1.5">
            {connectedProvider && (
              <Logo
                svg={connectedProvider.logoSvg}
                name={connectedProvider.name}
                className="size-4 rounded-[4px] text-[10px]"
              />
            )}
            Connected
          </span>
        </button>
      )}
      {!isGeneric && (
        <button
          type="button"
          aria-pressed={integration.connected}
          onClick={() => onPatch({ connected: !integration.connected })}
          className={`shrink-0 rounded-[12px] border px-[18px] py-[9px] text-[15px] font-semibold tracking-[-0.01em] transition active:scale-[0.97] cursor-pointer ${
            integration.connected
              ? "border-[hsla(145,45%,45%,0.35)] bg-[hsla(145,55%,96%,1)] text-[hsla(150,55%,28%,1)] hover:bg-[hsla(145,50%,93%,1)]"
              : "border-border-soft bg-card shadow-[0_1px_2px_hsla(48,8%,12%,0.08)] hover:bg-[hsla(43,30%,95%,1)]"
          }`}
        >
          {integration.connected ? (
            <span className="flex items-center gap-1.5">
              <svg
                className="size-3.5"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m2.5 7.5 3 3 6-6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Connected
            </span>
          ) : (
            "Connect"
          )}
        </button>
      )}
    </div>
  )
}

export function RecipeSetup({
  integrations: initialIntegrations
}: {
  integrations: Integration[]
}) {
  const [integrations, setIntegrations] = useState(initialIntegrations)

  const patchIntegration = (id: string, patch: Partial<Integration>) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
    )
  }

  const ready = integrations.every((i) => !i.required || i.connected)

  return (
    <>
      <section className="flex flex-col gap-2.5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
          Integrations
        </h2>
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onPatch={(patch) => patchIntegration(integration.id, patch)}
          />
        ))}
      </section>

      <div className="mt-auto flex flex-col items-center gap-5 pb-2">
        <div className="flex w-full items-center gap-2.5">
          <Link
            href="#"
            aria-disabled={!ready}
            tabIndex={ready ? undefined : -1}
            className={`flex min-h-14 flex-1 items-center justify-center rounded-[18px] text-[17px] font-semibold tracking-[-0.01em] transition ${
              ready
                ? "bg-[hsla(45,8%,10%,1)] text-white shadow-[0_6px_16px_hsla(48,8%,12%,0.22),inset_0_1px_0_hsla(0,0%,100%,0.12)] hover:shadow-[0_8px_20px_hsla(48,8%,12%,0.28),inset_0_1px_0_hsla(0,0%,100%,0.12)] active:scale-[0.98]"
                : "cursor-not-allowed bg-foreground/[0.08] text-foreground/35"
            }`}
          >
            Get Started
          </Link>
          <IconAction label="Duplicate">
            <Copy className="size-5" aria-hidden="true" />
          </IconAction>
          <IconAction label="Report a problem">
            <Flag className="size-5" aria-hidden="true" />
          </IconAction>
        </div>
        <nav
          className="flex items-center gap-2.5 text-sm font-medium text-faint"
          aria-label="Footer"
        >
          <Link href="#" className="transition-colors hover:text-muted">
            Use Cases
          </Link>
          <span className="select-none" aria-hidden="true">
            ·
          </span>
          <Link href="#" className="transition-colors hover:text-muted">
            poke.com
          </Link>
        </nav>

        <DebugPanel
          integrations={integrations}
          onRequiredChange={(id, required) =>
            patchIntegration(id, { required })
          }
        />
      </div>
    </>
  )
}
