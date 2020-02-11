import React from 'react'
import { default as CardInterface } from '../../interfaces/Card'

function Card(props: CardInterface) {
  const { name, rarity, description } = props

  return (
    <div>
      <h3>{name}</h3>

      <div>{rarity}</div>

      <div>{description}</div>
    </div>
  )
}

export default Card
