import React from 'react'
import styled from 'styled-components'
import { default as CardInterface } from '../../interfaces/Card'
import { buttonReset } from '../../styles/resets'

interface CardProps extends CardInterface {
  key: string
  isRevealed?: boolean
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void
}

const StyledCard = styled('div')`
  ${buttonReset}
  position: relative; /* allows absolute positioning within */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #ccc;
  /* based on the standard width/height ratios of casino playing cards */
  height: 17.5rem;
  width: 11.25rem;
  padding: 1rem;
  text-align: center;
`

const Rarity = styled('div')`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`

function Card(props: CardProps) {
  const { name, rarity, description, id, onClick } = props

  return (
    <StyledCard as={onClick ? 'button' : 'div'} id={`card-${id}`} onClick={onClick}>
      <h3>{name}</h3>

      <div>{description}</div>

      <Rarity>{rarity}</Rarity>
    </StyledCard>
  )
}

export default Card
