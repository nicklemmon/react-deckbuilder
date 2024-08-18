import type { Spacing } from '../types/tokens'
import css from './stack.module.css'

export function Stack({
  children,
  spacing = '300',
}: {
  children: React.ReactNode
  spacing: Spacing
}) {
  return (
    <div
      className={css['stack']}
      style={{ '--gap': `var(--spacing-${spacing})` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
