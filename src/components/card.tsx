import { clsx } from 'clsx'
import type { Card } from '../types/cards'
import cardBackImg from '../images/card-back.png'
import swordIcon from '../images/sword.png'
import { Stats, StatsRow, Stat, StatIcon, StatVal } from './stats'
import css from './card.module.css'

export function Card({
  description,
  name,
  onClick,
  rarity,
  isStacked,
  orientation,
  status = 'idle',
  stats,
  artwork,
  id,
}: { isStacked?: boolean; onClick?: () => void } & Card) {
  const withStateClsx = (rootClass: string) => {
    return clsx({
      [rootClass]: true,
      [css['disabled']]: status === 'disabled',
      [css['purchased']]: status === 'purchased',
      [css['in-play']]: status === 'in-play',
      [css['idle']]: status === 'idle',
      [css['face-down']]: orientation === 'face-down',
      [css['face-up']]: orientation === 'face-up',
      [css['stacked']]: isStacked === true,
      [css['rarity-0']]: rarity === 0,
      [css['rarity-1']]: rarity === 1,
      [css['rarity-2']]: rarity === 2,
      [css['rarity-3']]: rarity === 3,
    })
  }

  return (
    <div className={withStateClsx(css['card'])} onClick={onClick} id={id}>
      <div className={withStateClsx(css['card-front'])}>
        <div className={withStateClsx(css['card-header'])}>
          <div className={withStateClsx(css['card-name'])}>{name}</div>
        </div>

        <div className={withStateClsx(css['card-content'])}>
          <img
            src={artwork}
            className={withStateClsx(css['card-artwork'])}
            alt=""
            role="presentation"
          />

          <div className={withStateClsx(css['card-description'])}>{description}</div>
        </div>

        <div className={withStateClsx(css['card-footer'])}>
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

      <div className={withStateClsx(css['card-back'])}>
        <img className={css['card-back-img']} src={cardBackImg} alt="" role="presentation" />
        <div className={css['card-back-overlay']} />
      </div>
    </div>
  )
}
