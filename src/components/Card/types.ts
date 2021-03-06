import { Card } from 'src/interfaces'

export interface CardProps extends Card {
  key: string
  cardIndex: number
  isStacked?: boolean
  isRevealed?: boolean
  onClick?: () => void
  align?: string
  showPrice?: boolean
}
