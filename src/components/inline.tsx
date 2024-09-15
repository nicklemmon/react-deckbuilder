import { clsx } from 'clsx'
import type { Spacing } from '../types/tokens'
import css from './inline.module.css'

export function Inline({
  className,
  children,
  spacing = '300',
  align = 'center',
}: {
  children: React.ReactNode
  className?: string
  spacing?: Spacing
  align?: 'top' | 'bottom' | 'center'
}) {
  const alignClass = align === 'top' ? css.top : align === 'bottom' ? css.bottom : css.center

  return (
    <div
      className={clsx(css['inline'], alignClass, className)}
      style={{ '--gap': `var(--spacing-${spacing})` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
