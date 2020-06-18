import React from 'react'
import { useGameMachine } from 'src/GameMachineContext'
import { Card, Deck } from 'src/components'
import CardInterface from 'src/interfaces/Card'

export default function DiscardPile() {
  const [state] = useGameMachine()

  return (
    <Deck isStacked={true} align="right">
      {state.context.discardPile.map((card: CardInterface, index: number) => (
        <Card cardIndex={index} key={`discard-pile-card-${index}`} {...card} />
      ))}
    </Deck>
  )
}
