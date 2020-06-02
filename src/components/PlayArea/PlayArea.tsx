import React from 'react'
import { useMachine } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import PlayAreaMachine from './PlayAreaMachine'
import rng from 'src/functions/rng'
import { Deck } from 'src/components/Deck'
import { Banner } from 'src/components/Banner'
import { Button } from 'src/components/Button'
import { Card } from 'src/components/Card'
import { Monster } from 'src/components/Monster'
import { Player } from 'src/components/Player'
import { StateMachineViewer } from 'src/components/StateMachineViewer'
import CardInterface from 'src/interfaces/Card'
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
        <AnimatePresence>
          <motion.div
            style={{ position: 'fixed', left: '50%', top: '50%', zIndex: 1 }}
            initial={{ y: '-70%', x: '-50%', scale: 0.75, opacity: 0 }}
            animate={{ y: '-50%', x: '-50%', scale: 1, opacity: 1 }}
            exit={{ y: '-30%', x: '-50%', scale: 1, opacity: 0 }}
          >
            <Banner>
              Victory!{' '}
              <Button
                style={{ marginLeft: '1rem' }}
                variant="primary"
                onClick={() => send('NEXT_BATTLE_CLICK')}
              >
                Next Battle
              </Button>
            </Banner>
          </motion.div>
        </AnimatePresence>
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
                positionTransition={true}
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
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: -20, rotate: -rng(25) + rng(25), opacity: 1 }}
              exit={{ y: -20, x: 200, opacity: 0 }}
              transition={{
                duration: 0.2,
                type: 'tween',
                ease: 'easeIn',
              }}
              isDisabled={false}
              cardIndex={0}
              {...cardInPlay}
            />
          )}
        </AnimatePresence>
      </CardInPlayWrapper>

      <BattleWrapper>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0 }}
        >
          <Player
            name={context.player.name}
            level={context.player.level}
            stats={context.player.stats}
            artwork={context.player.artwork}
          />
        </motion.div>

        <AnimatePresence>
          {monster && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 0, y: 25, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Monster
                id={monster.id}
                name={monster.name}
                level={monster.level}
                stats={monster.stats}
                artwork={monster.artwork}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
