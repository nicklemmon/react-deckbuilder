import css from './health-bar.module.css'

/** Shows a health bar */
export function HealthBar({ health }: { health: number }) {
  return (
    <div
      className={css['health-bar']}
      style={{ '--health-percentage': `${health}` } as React.CSSProperties}
    >
      <div className={css['health-bar-fill']} />
    </div>
  )
}
