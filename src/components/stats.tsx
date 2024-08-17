import css from './stats.module.css'

export function Stats({ children }: { children: React.ReactNode }) {
  return <div className={css['stats']}>{children}</div>
}

export function StatsRow({ children }: { children: React.ReactNode }) {
  return <div className={css['stats-row']}>{children}</div>
}

export function Stat({ children }: { children: React.ReactNode }) {
  return <div className={css['stat']}>{children}</div>
}

export function StatIcon({ src }: { src: string }) {
  return <img src={src} className={css['stat-icon']} />
}

export function StatVal({ children }: { children: React.ReactNode }) {
  return <div className={css['stat-val']}>{children}</div>
}
