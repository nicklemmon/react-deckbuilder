import { clsx } from 'clsx'
import type { Card } from '../types/cards'
import { Stats, StatsRow, Stat, StatIcon, StatVal } from './stats'
import css from './card.module.css'

export function Card({
  align,
  deckIndex,
  description,
  name,
  onClick,
  rarity,
  isStacked,
  orientation,
  status,
  stats,
}: { deckIndex: number; isStacked?: boolean; onClick?: () => void } & Card) {
  const withStateClsx = (rootClass: string) => {
    return clsx({
      [rootClass]: true,
      [css['disabled']]: status === 'disabled',
      [css['purchased']]: status === 'purchased',
      [css['face-down']]: orientation === 'face-down',
      [css['face-down']]: orientation === 'face-up',
      [css['stacked']]: isStacked === true,
      [css['align-left']]: align === 'left',
      [css['align-right']]: align === 'right',
      [css['rarity-0']]: rarity === 0,
      [css['rarity-1']]: rarity === 1,
      [css['rarity-2']]: rarity === 2,
      [css['rarity-3']]: rarity === 3,
    })
  }

  return (
    <div
      className={withStateClsx(css['card'])}
      onClick={onClick}
      style={{ '--card-offset': isStacked ? `${deckIndex * 1}rem` : '0' } as React.CSSProperties}
    >
      <div className={withStateClsx(css['card-front'])}>
        <div className={withStateClsx(css['card-header'])}>
          <div className={withStateClsx(css['card-name'])}>{name}</div>
        </div>

        <div className={withStateClsx(css['card-content'])}>
          <div className={withStateClsx(css['card-description'])}>{description}</div>
        </div>

        <div className={withStateClsx(css['card-footer'])}>
          <Stats>
            <StatsRow>
              {stats?.attack ? (
                <Stat>
                  <StatVal>{stats.attack}</StatVal>
                </Stat>
              ) : null}
            </StatsRow>
          </Stats>
        </div>
      </div>

      <div className={withStateClsx(css['card-back'])} />
    </div>
  )
}
