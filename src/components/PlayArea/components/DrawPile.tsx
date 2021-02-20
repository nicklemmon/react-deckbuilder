import React from 'react'
import { useGameMachine } from 'src/GameMachineContext'
import { Deck } from 'src/components/Deck'
import { Card } from 'src/components/Card'
import { Card as CardInterface } from 'src/interfaces/Card'

export function DrawPile() {
  const [state] = useGameMachine()

  return (
    <Deck isStacked={true} align="right">
      {state.context.drawPile.map((card: CardInterface, index: number) => (
        <Card cardIndex={index} key={`draw-pile-card-${index}`} {...card} />
      ))}
    </Deck>
  )
}
