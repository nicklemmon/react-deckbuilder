import { Item } from '../../interfaces'

export interface ItemProps extends Item {
  itemIndex: number
  onClick?: () => void
  badge?: React.ReactChild
}
