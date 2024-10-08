import { clsx } from 'clsx'
import type { Card } from '../types/cards'
import cardBackImg from '../images/card-back.png'
import swordIcon from '../images/sword.png'
import { StatsRow, StatIcon, StatVal } from './stats'
import css from './card.module.css'

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
  id,
}: { isStacked?: boolean; onClick?: () => void; className?: string } & Card) {
  const withClsx = (rootClass: string, additionalClassName?: string) => {
    return clsx(
      {
        [rootClass]: true,
        [css['disabled']]: status === 'disabled',
        [css['in-play']]: status === 'in-play',
        [css['idle']]: status === 'idle',
        [css['face-down']]: orientation === 'face-down',
        [css['face-up']]: orientation === 'face-up',
        [css['stacked']]: isStacked === true,
        [css['rarity-0']]: rarity === 0,
        [css['rarity-1']]: rarity === 1,
        [css['rarity-2']]: rarity === 2,
        [css['rarity-3']]: rarity === 3,
      },
      additionalClassName,
    )
  }

  return (
    <div className={withClsx(css['card'], className)} onClick={onClick} id={id}>
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

      <div className={withClsx(css['card-back'])}>
        <img className={css['card-back-img']} src={cardBackImg} alt="" role="presentation" />
        <div className={css['card-back-overlay']} />
      </div>
    </div>
  )
}
