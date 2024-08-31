import { clsx } from 'clsx'
import type { Spacing } from '../types/tokens'
import css from './stack.module.css'

export function Stack({
  className,
  children,
  spacing = '300',
}: {
  children: React.ReactNode
  className?: string
  spacing?: Spacing
}) {
  return (
    <div
      className={clsx(css['stack'], className)}
      style={{ '--gap': `var(--spacing-${spacing})` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
