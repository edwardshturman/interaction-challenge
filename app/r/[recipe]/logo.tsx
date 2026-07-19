export function Logo({
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
