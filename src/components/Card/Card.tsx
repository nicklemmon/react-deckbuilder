import React from 'react'
import { motion } from 'framer-motion'
import { Stats, AttackStat, GoldStat } from 'src/components/Stats'
import {
  CardWrapper,
  Header,
  Heading,
  Content,
  Description,
  Main,
  Footer,
  Back,
  Overlay,
  OverlayImg,
  OverlayText,
} from './CardStyles'
import bagImg from 'src/images/bag.png'
import { CardStatus } from 'src/interfaces'
import { CardProps } from './types'

function Card(props: CardProps) {
  const {
    cardIndex,
    name,
    rarity,
    description,
    id,
    onClick,
    status = CardStatus['face-down'],
    isStacked = true,
    align = 'left',
    stats,
    artwork,
    price,
    showPrice,
  } = props

  return (
    <CardWrapper
      cardIndex={cardIndex}
      isStacked={isStacked}
      align={align}
      id={`card-${id}`}
      onClick={onClick}
      artwork={artwork}
      status={status}
    >
      {status === CardStatus['purchased'] ? <PurchasedOverlay /> : null}

      <Content rarity={rarity} status={status}>
        <Header>
          <Heading>{name}</Heading>
        </Header>

        <Main>
          <Description>{description}</Description>
        </Main>

        <Footer>
          <Stats>
            <Stats.Row>
              {stats?.attack && <AttackStat>{stats.attack}</AttackStat>}

              {showPrice && price && <GoldStat>{price}</GoldStat>}
            </Stats.Row>
          </Stats>
        </Footer>
      </Content>

      <Back role="presentation" status={status} />
    </CardWrapper>
  )
}

function PurchasedOverlay() {
  return (
    <Overlay initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
      <motion.div
        style={{ scale: 0.75 }}
        initial={{ y: -200 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', delay: 0.125, damping: 10, mass: 0.125 }}
      >
        <OverlayImg src={bagImg} role="presentation" alt="" />
      </motion.div>

      <OverlayText
        initial={{ opacity: 0, y: 500 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', delay: 0.2, damping: 10, mass: 0.125 }}
      >
        Purchased!
      </OverlayText>
    </Overlay>
  )
}

export default Card
