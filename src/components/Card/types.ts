import { Card, CardStatus } from '../../interfaces'

export type CardOnClick = () => void | ((card: Card) => void)

export interface CardProps extends Card {
  cardIndex: number
  status?: CardStatus
  isStacked?: boolean
  className?: string
  onClick?: () => void | ((card: Card) => void)
  align?: string
  showPrice?: boolean
}
