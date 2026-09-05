import { clsx } from 'clsx'
import css from './stats.module.css'

export function StatsRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string | undefined
}) {
  return <div className={clsx(css['stats-row'], className)}>{children}</div>
}

export function StatIcon({ src, className }: { src: string; className?: string | undefined }) {
  return <img src={src} className={clsx(css['stat-icon'], className)} />
}

export function StatVal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string | undefined
}) {
  return <div className={clsx(css['stat-val'], className)}>{children}</div>
}
