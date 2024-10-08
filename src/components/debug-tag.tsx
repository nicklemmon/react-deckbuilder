export function DebugTag({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        backgroundColor: 'hotpink',
        color: 'white',
        fontSize: 'var(--font-size-200)',
        padding: 'var(--spacing-100) var(--spacing-200)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
