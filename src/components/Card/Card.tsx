import React from 'react'
import { motion } from 'framer-motion'
import { Card as CardInterface } from 'src/interfaces'
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

interface CardProps extends CardInterface {
  key: string
  cardIndex: number
  isStacked?: boolean
  isDisabled?: boolean
  isRevealed?: boolean
  onClick?: () => void
  align?: string
  showPrice?: boolean
}

function Card(props: CardProps) {
  const {
    cardIndex,
    name,
    rarity,
    description,
    id,
    onClick,
    isDisabled = true,
    isPurchased = false,
    isRevealed = false,
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
      isDisabled={isDisabled}
      isPurchased={isPurchased}
    >
      {isPurchased && <CardOverlay variant="purchased" />}

      <Content rarity={rarity} isVisible={isRevealed}>
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

      <Back role="presentation" isVisible={!isRevealed} />
    </CardWrapper>
  )
}

interface OverlayProps {
  variant?: any
}

function CardOverlay(props: OverlayProps) {
  const { variant } = props

  switch (variant) {
    case 'purchased':
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

    default:
      return <></>
  }
}

export default Card
