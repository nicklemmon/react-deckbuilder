import { useState, type MouseEvent } from 'react'
import type { Card } from '../types/cards'
import cardBackImg from '../images/card-back.webp'
import cardBackRainbowImg from '../images/card-back.rainbow.webp'
import swordIcon from '../images/sword.webp'
import { cx } from '../helpers/css'
import { StatsRow, StatIcon, StatVal } from './stats'
import css from './card.module.css'
import { CARD_FINISH_DEFAULTS, CardFinishLayer, type CardFinish } from './card-finish'
import type { AppMachineContext } from '../machines/app-machine/app-machine'

export function Card({
  className,
  description,
  name,
  onClick,
  rarity,
  isStacked,
  orientation = 'face-up',
  status = 'idle',
  stats,
  artwork,
  mode = 'standard',
  id,
  finish = 'none',
  finishIntensity = CARD_FINISH_DEFAULTS[finish],
  finishAnimated = true,
}: {
  finish?: CardFinish
  finishIntensity?: number
  finishAnimated?: boolean
  isStacked?: boolean
  onClick?: () => void
  mode?: AppMachineContext['game']['mode']
  className?: string
} & Omit<Card, 'align' | 'price' | 'sfx'>) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const withClsx = (rootClass: string | undefined, additionalClassName?: string | undefined) => {
    return cx(
      css,
      {
        disabled: status === 'disabled',
        'in-play': status === 'in-play',
        idle: status === 'idle',
        'face-down': orientation === 'face-down',
        'face-up': orientation === 'face-up',
        stacked: isStacked === true,
        'rarity-0': rarity === 0,
        'rarity-1': rarity === 1,
        'rarity-2': rarity === 2,
        'rarity-3': rarity === 3,
      },
      rootClass,
      additionalClassName,
    )
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (orientation !== 'face-up' || status !== 'idle') return

    if (!isHovering) setIsHovering(true)

    const card = e.currentTarget
    const rect = card.getBoundingClientRect()

    // Calculate cursor position relative to card center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    // Convert to rotation degrees (max ±8 degrees for subtle effect)
    const maxTilt = 8
    const rotateY = x * maxTilt * 2 // Multiply by 2 since x ranges from -0.5 to 0.5
    const rotateX = -y * maxTilt * 2 // Negative for natural tilt direction

    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setIsHovering(false)
  }

  const isHoverable = orientation === 'face-up' && status === 'idle'
  const translateY = isHoverable && isHovering ? 'calc(-1 * var(--spacing-100))' : '0px'

  // Calculate sheen position (0 to 100%)
  const sheenX = isHoverable && isHovering ? ((tilt.rotateY / 16 + 0.5) * 100).toFixed(1) : '50'
  const sheenY = isHoverable && isHovering ? ((-tilt.rotateX / 16 + 0.5) * 100).toFixed(1) : '50'

  return (
    <div
      data-game-mode={mode}
      className={withClsx(css['card'], className)}
      onClick={onClick}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(${translateY})`,
          '--sheen-x': `${sheenX}%`,
          '--sheen-y': `${sheenY}%`,
        } as React.CSSProperties
      }
    >
      <div className={withClsx(css['card-front'])}>
        <div className={withClsx(css['card-header'])}>
          <div className={withClsx(css['card-name'])}>{name}</div>
        </div>

        <div className={withClsx(css['card-content'])}>
          <img src={artwork} className={withClsx(css['card-artwork'])} alt="" role="presentation" />

          <div className={withClsx(css['card-description'])}>{description}</div>
        </div>

        <div className={withClsx(css['card-footer'])}>
          <StatsRow className={css['card-stats-row']}>
            {stats?.attack ? (
              <>
                <StatIcon src={swordIcon} />
                <StatVal>{stats.attack}</StatVal>
              </>
            ) : null}
          </StatsRow>
        </div>
      </div>

      {orientation === 'face-up' && (
        <CardFinishLayer finish={finish} intensity={finishIntensity} animated={finishAnimated} />
      )}

      <div className={withClsx(css['card-back'])}>
        <img
          className={css['card-back-img']}
          src={mode === 'standard' ? cardBackImg : cardBackRainbowImg}
          alt=""
          role="presentation"
        />
        <div className={css['card-back-overlay']} />
      </div>
    </div>
  )
}
