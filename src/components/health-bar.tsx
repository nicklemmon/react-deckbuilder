import css from './health-bar.module.css'

/** Shows a health bar */
export function HealthBar({ health, maxHealth }: { health: number; maxHealth: number }) {
  const healthPercentage = health / maxHealth
  const healthText = health > 0 ? health : 0

  return (
    <div className={css['health-bar-wrapper']}>
      <div
        className={css['health-bar']}
        style={{ '--health-percentage': `${healthPercentage}` } as React.CSSProperties}
      >
        <div className={css['health-bar-fill']} />
      </div>

      <div className={css['health-bar-text-wrapper']}>
        <div className={css['health-bar-text']}>{healthText} HP</div>
      </div>
    </div>
  )
}
