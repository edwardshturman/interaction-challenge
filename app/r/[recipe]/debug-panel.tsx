import type { Integration } from "@/lib/recipes"

function Switch({
  checked,
  onChange,
  label
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50 ${
        checked ? "bg-foreground" : "bg-foreground/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-card shadow-[0_1px_2px_hsla(48,8%,12%,0.2)] transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export function DebugPanel({
  integrations,
  onRequiredChange
}: {
  integrations: Integration[]
  onRequiredChange: (id: string, required: boolean) => void
}) {
  return (
    <section
      aria-label="Debug controls"
      className="w-full rounded-[18px] border border-dashed border-foreground/20 px-4 py-3.5"
    >
      <h2 className="text-[11px] font-semibold tracking-[0.08em] text-faint uppercase">
        Debug
      </h2>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {integrations.map((integration) => (
          <label
            key={integration.id}
            className="flex items-center justify-between gap-3 text-sm font-medium text-muted"
          >
            {integration.name} required
            <Switch
              checked={integration.required}
              label={`${integration.name} required`}
              onChange={(required) =>
                onRequiredChange(integration.id, required)
              }
            />
          </label>
        ))}
      </div>
    </section>
  )
}
