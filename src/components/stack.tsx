import { clsx } from 'clsx'
import type { Spacing } from '../types/tokens'
import css from './stack.module.css'

const ALIGN_PROP_VALS = ['left', 'right', 'center'] as const

type AlignProp = (typeof ALIGN_PROP_VALS)[number]

const ALIGN_CLASS_MAP: Record<AlignProp, string> = {
  left: css['left'],
  right: css['right'],
  center: css['center'],
}

export function Stack({
  className,
  children,
  spacing = '300',
  align = 'left',
  style,
}: {
  children: React.ReactNode
  className?: string
  spacing?: Spacing
  align?: AlignProp
  style?: React.CSSProperties
}) {
  const alignClass = ALIGN_CLASS_MAP[align]

  return (
    <div
      className={clsx(css['stack'], alignClass, className)}
      style={{ '--gap': `var(--spacing-${spacing})`, ...style } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
