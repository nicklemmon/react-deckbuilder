import React from 'react'
import { default as CardInterface } from '../../interfaces/Card'
import SwordImg from '../../images/sword.png'
import {
  CardWrapper,
  CardIcon,
  Header,
  Content,
  Main,
  Footer,
  Stats,
  Stat,
  StatNumber,
  Rarity,
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
  } = props

  return (
    <CardWrapper
      cardIndex={cardIndex}
      isStacked={isStacked}
      align={align}
      id={`card-${id}`}
      onClick={onClick}
      style={{ pointerEvents: isDisabled ? 'none' : 'initial' }}
    >
      <Content isVisible={isRevealed}>
        <Header>
          <h3>{name}</h3>
        </Header>

        <Main>
          <div>{description}</div>
        </Main>

        <Footer>
          <Stats>
            {stats.attack && (
              <Stat>
                <CardIcon src={SwordImg} alt="Attack:" />

                <StatNumber>{stats.attack}</StatNumber>
              </Stat>
            )}

            {/* {stats.defense && (
              <div>
                <span role="img" aria-label="Defense:">
                  🛡️
                </span>

                {stats.defense}
              </div>
            )} */}
          </Stats>

          <Rarity>{rarity}</Rarity>
        </Footer>
      </Content>

      <Back role="presentation" isVisible={!isRevealed} />
    </CardWrapper>
  )
}

export default Card
