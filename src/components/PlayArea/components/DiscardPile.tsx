import React from 'react'
import { Card, Deck } from 'src/components'
import { Card as CardInterface, CardStatus } from 'src/interfaces/Card'

interface DiscardPileProps {
  state: any // TODO: Implement real type
}

export function DiscardPile(props: DiscardPileProps) {
  const { state } = props

  return (
    <Deck isStacked={true} align="right">
      {state.context.discardPile.map((card: CardInterface, index: number) => {
        return (
          <Card
            {...card}
            key={`discard-pile-card-${index}`}
            cardIndex={index}
            status={CardStatus['face-down']}
          />
        )
      })}
    </Deck>
  )
}
