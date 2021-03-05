import React from 'react'
import { Stats, HealthStat, GoldStat } from 'src/components'
import { ArtworkWrapper, Artwork, ItemWrapper, Footer } from './ItemStyles'
import { ItemStatus } from 'src/interfaces'
import { ItemProps } from './types'

export function Item(props: ItemProps) {
  const { artwork, onClick, status = ItemStatus['idle'], stats, price } = props

  return (
    <ItemWrapper onClick={onClick} status={status}>
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
