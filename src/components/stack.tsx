import { clsx } from 'clsx'
import type { Spacing } from '../types/tokens'
import css from './stack.module.css'

export function Stack({
  className,
  children,
  spacing = '300',
  align = 'left',
}: {
  children: React.ReactNode
  className?: string
  spacing?: Spacing
  align?: 'left' | 'right' | 'center'
}) {
  const alignClass = align === 'left' ? css.left : align === 'right' ? css.right : css.center

  return (
    <div
      className={clsx(css['stack'], alignClass, className)}
      style={{ '--gap': `var(--spacing-${spacing})` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
