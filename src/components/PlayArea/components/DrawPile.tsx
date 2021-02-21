import React from 'react'
import { Deck } from 'src/components/Deck'
import { Card } from 'src/components/Card'
import { Card as CardInterface } from 'src/interfaces/Card'

interface DrawPileProps {
  state: any // TODO: Implement real type
}

export function DrawPile(props: DrawPileProps) {
  const { state } = props

  return (
    <Deck isStacked={true} align="right">
      {state.context.drawPile.map((card: CardInterface, index: number) => (
        <Card cardIndex={index} key={`draw-pile-card-${index}`} {...card} />
      ))}
    </Deck>
  )
}
