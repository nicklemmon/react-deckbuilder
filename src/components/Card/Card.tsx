import React from 'react'
import styled from 'styled-components'
import { default as CardInterface } from '../../interfaces/Card'

interface CardProps extends CardInterface {
  key: string
  isRevealed?: boolean
  isDisabled?: boolean
  onClick?: () => void
}

const Wrapper = styled('div')`
  display: grid;
  grid-template-rows: 1fr 4fr 1fr;
  background-color: #fff;
  border: 1px solid #ccc;
  /* based on the standard width/height ratios of casino playing cards */
  height: 17.5rem;
  width: 11.25rem;
  text-align: center;
`

const Header = styled('div')`
  padding: 2rem 1rem 1rem 1rem;
  font-weight: 700;
`

const Content = styled('div')`
  padding: 1rem;
  align-self: center;
`

const Footer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f7f7f7;
`

const Stats = styled('div')``

const Rarity = styled('div')``

function Card(props: CardProps) {
  const { name, rarity, description, id, onClick, isDisabled, stats } = props

  return (
    <Wrapper
      id={`card-${id}`}
      onClick={onClick}
      style={{ pointerEvents: isDisabled ? 'none' : 'initial' }}
    >
      <Header>
        <h3>{name}</h3>
      </Header>

      <Content>
        <div>{description}</div>
      </Content>

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
    </Wrapper>
  )
}

export default Card
