import React from 'react'
import { useMachine } from '@xstate/react'
import PlayAreaMachine from './PlayAreaMachine'
import { Deck } from '../Deck'
import { Card } from '../Card'
import { Monster } from '../Monster'
import { PlayerAvatar } from '../PlayerAvatar'
import { StateMachineViewer } from '../StateMachineViewer'
import CardInterface from '../../interfaces/Card'
import {
  CardInPlayWrapper,
  CurrentHandWrapper,
  DiscardPileWrapper,
  DrawPileWrapper,
  Feedback,
  BattleWrapper,
  PlayAreaWrapper,
  PlayerDeckWrapper,
} from './PlayAreaStyles'

interface PlayAreaProps {
  children?: any
}

export default function PlayArea(props: PlayAreaProps) {
  const [current, send] = useMachine(PlayAreaMachine)
  const { context } = current
  const cardInPlay: any = context.cardInPlay
  const monster: any = context.monster

  return (
    <PlayAreaWrapper>
      <StateMachineViewer currentState={current} />

      <PlayerDeckWrapper numberOfCards={context.playerDeck.length}>
        <Deck isStacked={true}>
          {context.playerDeck.map((card: CardInterface, index: number) => (
            <Card cardIndex={index} key={`player-deck-card-${index}`} {...card} />
          ))}
        </Deck>
      </PlayerDeckWrapper>

      <DrawPileWrapper>
        <Deck isStacked={true} align="right">
          {context.drawPile.map((card: CardInterface, index: number) => (
            <Card cardIndex={index} key={`draw-pile-card-${index}`} {...card} />
          ))}
        </Deck>
      </DrawPileWrapper>

      <CurrentHandWrapper>
        {context.currentHand && (
          <Deck isStacked={false}>
            {context.currentHand.map((card: CardInterface, index: number) => (
              <Card
                cardIndex={index}
                key={`current-hand-card-${index}`}
                onClick={() => send({ type: 'CHOOSE', data: { card } })}
                isDisabled={current.value !== 'choosing'}
                {...card}
              />
            ))}
          </Deck>
        )}
      </CurrentHandWrapper>

      <CardInPlayWrapper>
        {cardInPlay && <Card isDisabled={false} cardIndex={0} key="card-in-play" {...cardInPlay} />}
      </CardInPlayWrapper>

      <BattleWrapper>
        <PlayerAvatar
          name={context.player.name}
          level={context.player.level}
          stats={context.player.stats}
        />

        {monster && (
          <Monster
            id={monster.id}
            name={monster.name}
            level={monster.level}
            stats={monster.stats}
          />
        )}
      </BattleWrapper>

      {context.feedback && (
        <Feedback>
          <p>{context.feedback}</p>
        </Feedback>
      )}

      <DiscardPileWrapper>
        <Deck isStacked={true} align="right">
          {context.discardPile.map((card: CardInterface, index: number) => (
            <Card cardIndex={index} key={`discard-pile-card-${index}`} {...card} />
          ))}
        </Deck>
      </DiscardPileWrapper>
    </PlayAreaWrapper>
  )
}
