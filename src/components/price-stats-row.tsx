import { StatsRow, StatIcon, StatVal } from './stats'
import coinsIcon from '../images/gold-coins.png'
import css from './price-stats-row.module.css'

export function PriceStatsRow({ price }: { price: number }) {
  return (
    <StatsRow className={css['price-stats-row']}>
      <StatIcon src={coinsIcon} />
      <StatVal>{price}</StatVal>
    </StatsRow>
  )
}
