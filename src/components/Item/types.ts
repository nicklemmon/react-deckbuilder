import { Item } from 'src/interfaces'

export interface ItemProps extends Item {
  itemIndex: number
  onClick?: () => void
  badge?: React.ReactChild
}
