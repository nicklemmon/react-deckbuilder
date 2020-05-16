import React from 'react'
import { useMachine } from '@xstate/react'
import styled from 'styled-components'
import PlayAreaMachine from './PlayAreaMachine'
import { Deck } from '../Deck'
import { Card } from '../Card'
import { Monster } from '../Monster'
import { StateMachineViewer } from '../StateMachineViewer'
import CardInterface from '../../interfaces/Card'

interface PlayAreaProps {
  children?: any
}

const StyledPlayArea = styled('div')`
  padding: 2rem;
`

export default function PlayArea(props: PlayAreaProps) {
  const [current, send] = useMachine(PlayAreaMachine)
  const { context } = current
  const cardInPlay: any = context.cardInPlay
  const monster: any = context.monster

  return (
    <StyledPlayArea>
      <h2>PlayArea</h2>

      <StateMachineViewer currentState={current} />

      <h3>Player Deck:</h3>

      <Deck>
        {context.playerDeck.map((card: CardInterface, index: number) => (
          <Card key={`player-deck-card-${index}`} {...card} />
        ))}
      </Deck>

      <h3>Draw Pile:</h3>

      <Deck>
        {context.drawPile.map((card: CardInterface, index: number) => (
          <Card key={`draw-pile-card-${index}`} {...card} />
        ))}
      </Deck>

      <h3>Current Hand:</h3>

      {context.currentHand.length ? (
        <Deck>
          {context.currentHand.map((card: CardInterface, index: number) => (
            <Card
              key={`current-hand-card-${index}`}
              onClick={() => send({ type: 'CHOOSE', data: { card } })}
              isDisabled={current.value !== 'choosing'}
              {...card}
            />
          ))}
        </Deck>
      ) : (
        <p>No current hand.</p>
      )}

      <h3>Card In Play:</h3>

      {cardInPlay ? (
        <Card
          key="card-in-play"
          id={cardInPlay.id}
          name={cardInPlay.name}
          rarity={cardInPlay.rarity}
          description={cardInPlay.description}
          stats={cardInPlay.stats}
        />
      ) : (
        <p>No card currently in play.</p>
      )}

      <h3>Monster:</h3>

      {monster && (
        <Monster id={monster.id} name={monster.name} level={monster.level} stats={monster.stats} />
      )}

      {context.feedback && (
        <p>
          <em>{context.feedback}</em>
        </p>
      )}

      <h3>Discard Pile:</h3>

      <Deck>
        {context.discardPile.map((card: CardInterface, index: number) => (
          <Card key={`discard-pile-card-${index}`} {...card} />
        ))}
      </Deck>
    </StyledPlayArea>
  )
}
