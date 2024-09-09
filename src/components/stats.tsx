import css from './stats.module.css'
import { clsx } from 'clsx'

export function Stats({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx(css['stats'], className)}>{children}</div>
}

export function StatsRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={clsx(css['stats-row'], className)}>{children}</div>
}

export function Stat({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx(css['stat'], className)}>{children}</div>
}

export function StatIcon({ src, className }: { src: string; className?: string }) {
  return <img src={src} className={clsx(css['stat-icon'], className)} />
}

export function StatVal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={clsx(css['stat-val'], className)}>{children}</div>
}
