import React from 'react'
import { Item as ItemInterface } from 'src/interfaces'
import { Stats, HealthStat, GoldStat } from 'src/components'
import { ArtworkWrapper, Artwork, ItemWrapper, Footer } from './ItemStyles'

interface ItemProps extends ItemInterface {
  itemIndex: number
  onClick?: () => void
  badge?: React.ReactChild
  isDisabled?: boolean
  isPurchased?: boolean
}

export function Item(props: ItemProps) {
  const { artwork, onClick, isDisabled, isPurchased, stats, price } = props

  return (
    <ItemWrapper onClick={onClick} isDisabled={isDisabled} isPurchased={isPurchased}>
      <ArtworkWrapper>
        <Artwork artwork={artwork} />
      </ArtworkWrapper>

      <Footer>
        <Stats>
          <Stats.Row>
            {stats.health && <HealthStat>{stats.health}</HealthStat>}

            <GoldStat>{price}</GoldStat>
          </Stats.Row>
        </Stats>
      </Footer>
    </ItemWrapper>
  )
}
