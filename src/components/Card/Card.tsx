import React from 'react'
import { default as CardInterface } from '../../interfaces/Card'
import swordImg from '../../images/sword.png'
import {
  CardWrapper,
  CardIcon,
  Header,
  Heading,
  Content,
  Description,
  Main,
  Footer,
  Stats,
  Stat,
  StatNumber,
  Back,
} from './CardStyles'

interface CardProps extends CardInterface {
  key: string
  cardIndex: number
  isStacked?: boolean
  isDisabled?: boolean
  isRevealed?: boolean
  onClick?: () => void
  align?: string
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
    isRevealed = false,
    isStacked = true,
    align = 'left',
    stats,
    artwork,
  } = props

  console.log('isDisabled', isDisabled)

  return (
    <CardWrapper
      cardIndex={cardIndex}
      isStacked={isStacked}
      align={align}
      id={`card-${id}`}
      onClick={onClick}
      artwork={artwork}
      isDisabled={isDisabled}
    >
      <Content rarity={rarity} isVisible={isRevealed}>
        <Header>
          <Heading>{name}</Heading>
        </Header>

        <Main>
          <Description>{description}</Description>
        </Main>

        <Footer>
          <Stats>
            {stats.attack && (
              <Stat>
                <CardIcon src={swordImg} alt="Attack:" />

                <StatNumber>{stats.attack}</StatNumber>
              </Stat>
            )}
          </Stats>
        </Footer>
      </Content>

      <Back role="presentation" isVisible={!isRevealed} />
    </CardWrapper>
  )
}

export default Card
