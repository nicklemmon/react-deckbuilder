import React from 'react'
import { default as CardInterface } from 'src/interfaces/Card'
import { Stats, AttackStat } from 'src/components/Stats'
import {
  CardWrapper,
  Header,
  Heading,
  Content,
  Description,
  Main,
  Footer,
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
  console.log('stats', stats)

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
          <Stats>{stats?.attack && <AttackStat>{stats.attack}</AttackStat>}</Stats>
        </Footer>
      </Content>

      <Back role="presentation" isVisible={!isRevealed} />
    </CardWrapper>
  )
}

export default Card
