import css from './health-bar.module.css'
import { Stack } from './stack'

/** Shows a health bar */
export function HealthBar({ health, maxHealth }: { health: number; maxHealth: number }) {
  const healthPercentage = health / maxHealth
  const healthText = health > 0 ? health : 0

  return (
    <Stack spacing="100">
      <div
        className={css['health-bar']}
        style={{ '--health-percentage': `${healthPercentage}` } as React.CSSProperties}
      >
        <div className={css['health-bar-fill']} />
      </div>

      <div className={css['health-bar-text']}>{healthText} HP</div>
    </Stack>
  )
}
