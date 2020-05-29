import React from 'react'
import { useMachine } from '@xstate/react'
import { AnimatePresence } from 'framer-motion'
import PlayAreaMachine from './PlayAreaMachine'
import rng from '../../functions/rng'
import { Deck } from '../Deck'
import { Banner } from '../Banner'
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

      {current.value === 'victory' && (
        <Banner>
          Victory! <button onClick={() => send('NEXT_BATTLE_CLICK')}>Next Battle</button>
        </Banner>
      )}

      {current.value === 'defeat' && <Banner>Defeat!</Banner>}

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
        <AnimatePresence>
          {cardInPlay && (
            <Card
              key="card-in-play"
              initial={{ y: 130, opacity: 0 }}
              animate={{ y: -30, rotate: -rng(25) + rng(25), opacity: 1 }}
              exit={{ y: -130, opacity: 0 }}
              transition={{
                duration: 0.25,
                type: 'tween',
                ease: 'linear',
              }}
              isDisabled={false}
              cardIndex={0}
              {...cardInPlay}
            />
          )}
        </AnimatePresence>
      </CardInPlayWrapper>

      <BattleWrapper>
        <PlayerAvatar
          name={context.player.name}
          level={context.player.level}
          stats={context.player.stats}
          artwork={context.player.artwork}
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
