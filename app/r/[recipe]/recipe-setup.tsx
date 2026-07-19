"use client"

import { useState } from "react"
import type { Integration } from "@/lib/recipes"
import { DebugPanel } from "./debug-panel"
import { Logo } from "./logo"

function IntegrationCard({
  integration,
  onConnectedChange
}: {
  integration: Integration
  onConnectedChange: (connected: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-border-soft bg-card px-4 py-3.5 shadow-soft">
      <Logo
        svg={integration.logoSvg}
        name={integration.name}
        className="size-10 shrink-0 rounded-[9px] text-base [&_svg]:rounded-[9px]"
      />
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
      <a
        href="#"
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-foreground/[0.06] hover:text-muted"
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
      </a>
      <button
        type="button"
        aria-pressed={integration.connected}
        onClick={() => onConnectedChange(!integration.connected)}
        className={`shrink-0 rounded-full border px-[18px] py-[9px] text-[15px] font-semibold tracking-[-0.01em] transition active:scale-[0.97] ${
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
            onConnectedChange={(connected) =>
              patchIntegration(integration.id, { connected })
            }
          />
        ))}
      </section>

      <div className="mt-auto flex flex-col items-center gap-5 pb-2">
        <a
          href="#"
          aria-disabled={!ready}
          tabIndex={ready ? undefined : -1}
          className={`flex min-h-14 w-full items-center justify-center rounded-[18px] text-[17px] font-semibold tracking-[-0.01em] transition ${
            ready
              ? "bg-[hsla(45,8%,10%,1)] text-white shadow-[0_6px_16px_hsla(48,8%,12%,0.22),inset_0_1px_0_hsla(0,0%,100%,0.12)] hover:shadow-[0_8px_20px_hsla(48,8%,12%,0.28),inset_0_1px_0_hsla(0,0%,100%,0.12)] active:scale-[0.98]"
              : "cursor-not-allowed bg-foreground/[0.08] text-foreground/35"
          }`}
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
