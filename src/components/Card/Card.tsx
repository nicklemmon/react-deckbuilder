import React from 'react'
import { default as CardInterface } from '../../interfaces/Card'

interface CardProps extends CardInterface {
  key: string
  isRevealed?: boolean
}

function Card(props: CardProps) {
  const { name, rarity, description, id } = props

  return (
    <div id={`card-${id}`}>
      <h3>{name}</h3>

      <div>{rarity}</div>

      <div>{description}</div>
    </div>
  )
}

export default Card
