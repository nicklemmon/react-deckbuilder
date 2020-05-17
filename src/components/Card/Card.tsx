import React from 'react'
import { default as CardInterface } from '../../interfaces/Card'
import { CardWrapper, Header, Content, Main, Footer, Stats, Rarity, Back } from './styles'

interface CardProps extends CardInterface {
  key: string
  cardIndex?: number
  isStacked?: boolean
  isDisabled?: boolean
  onClick?: () => void
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
    isStacked = true,
    stats,
  } = props

  return (
    <CardWrapper
      cardIndex={cardIndex}
      isStacked={isStacked}
      id={`card-${id}`}
      onClick={onClick}
      style={{ pointerEvents: isDisabled ? 'none' : 'initial' }}
    >
      <Content isVisible={!isDisabled}>
        <Header>
          <h3>{name}</h3>
        </Header>

        <Main>
          <div>{description}</div>
        </Main>

        <Footer>
          <Stats>
            {stats.attack && (
              <div>
                <span role="img" aria-label="Attack:">
                  ⚔️
                </span>

                {stats.attack}
              </div>
            )}

            {stats.defense && (
              <div>
                <span role="img" aria-label="Defense:">
                  🛡️
                </span>

                {stats.defense}
              </div>
            )}
          </Stats>

          <Rarity>{rarity}</Rarity>
        </Footer>
      </Content>

      <Back role="presentation" isVisible={isDisabled} />
    </CardWrapper>
  )
}

export default Card
