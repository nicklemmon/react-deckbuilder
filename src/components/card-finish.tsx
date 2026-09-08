import type { CSSProperties } from 'react'
import { cx } from '../helpers/css'
import css from './card-finish.module.css'

export type CardFinish = 'none' | 'foil' | 'prismatic' | 'gold' | 'ember'

export const CARD_FINISH_DEFAULTS: Readonly<Record<CardFinish, number>> = {
  none: 0,
  foil: 0.3,
  prismatic: 0.6,
  gold: 0.5,
  ember: 0.85,
}

type FinishStyle = CSSProperties & { '--finish-intensity': number }
type SparkStyle = CSSProperties & {
  '--spark-size': string
  '--spark-drift': string
  '--spark-rise': string
  '--spark-duration': string
  '--spark-delay': string
}

// Fixed, irregular seeds keep sparks stable when the card rerenders during hover.
const EMBER_SEEDS = [
  0.13, 0.72, 0.34, 0.91, 0.46, 0.08, 0.61, 0.83, 0.25, 0.53, 0.97, 0.39, 0.18, 0.67, 0.57, 0.04,
  0.78, 0.31,
]

/** Adds a decorative finish. Pointer coordinates are inherited from the card. */
export function CardFinishLayer({
  finish,
  intensity = CARD_FINISH_DEFAULTS[finish],
  animated = true,
}: {
  finish: CardFinish
  intensity?: number
  animated?: boolean
}) {
  if (finish === 'none') return null
  const style: FinishStyle = {
    '--finish-intensity': Math.max(0, Math.min(1, intensity)),
  }

  return (
    <div
      aria-hidden="true"
      className={cx(css, {
        finish: true,
        [finish]: true,
      })}
      data-animated={animated}
      style={style}
    >
      {finish === 'ember' &&
        EMBER_SEEDS.map((seed, index) => {
          const sparkStyle: SparkStyle = {
            left: `${seed * 100}%`,
            '--spark-size': `${1 + ((index * 7) % 11) / 6}px`,
            '--spark-drift': `${Math.sin(index * 2.4) * 24}px`,
            '--spark-rise': `${85 + ((index * 37) % 115)}px`,
            '--spark-duration': `${2.6 + seed * 3.8}s`,
            '--spark-delay': `${-seed * 13}s`,
          }

          return <span key={seed} className={css['spark']} style={sparkStyle} />
        })}
    </div>
  )
}
