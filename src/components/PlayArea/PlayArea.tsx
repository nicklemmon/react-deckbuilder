import React from 'react'
import { useMachine } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import GameMachine from 'src/GameMachine'
import { Deck } from 'src/components/Deck'
import { Banner } from 'src/components/Banner'
import { Button } from 'src/components/Button'
import { GoldStat, Stats } from 'src/components/Stats'
import { StatusBar } from 'src/components/StatusBar'
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
  BattleWrapper,
  PlayAreaWrapper,
  PlayerDeckWrapper,
} from './PlayAreaStyles'

interface PlayAreaProps {
  children?: any
}

export default function PlayArea(props: PlayAreaProps) {
  const [current, send] = useMachine(GameMachine)
  const { context } = current
  const inventory: any = context.player.inventory
  const cardInPlay: any = context.cardInPlay
  const monster: any = context.monster

  return (
    <PlayAreaWrapper>
      <StatusBar>
        <Stats>
          <GoldStat>{inventory.gold}</GoldStat>
        </Stats>
      </StatusBar>

      <StateMachineViewer currentState={current} />

      <AnimatePresence>
        {current.value === 'victory' && (
          <AnimatedBanner>
            Victory!
            <Button
              style={{ marginLeft: '1rem' }}
              variant="primary"
              onClick={() => send('NEXT_BATTLE_CLICK')}
            >
              Next Battle
            </Button>
          </AnimatedBanner>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {current.value === 'defeat' && <AnimatedBanner>Defeat!</AnimatedBanner>}
      </AnimatePresence>

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
            <motion.div
              key="card-in-play"
              initial={{ y: 100, opacity: 0, x: 0, scale: 1 }}
              animate={{ y: -50, opacity: 1, x: 0, scale: 1.05 }}
              exit={{ y: 175, x: 425, opacity: 0, rotate: 15, scale: 1 }}
              transition={{ type: 'spring', damping: 5, mass: 0.125, stiffness: 30 }}
            >
              <Card isDisabled={false} cardIndex={0} {...cardInPlay} />
            </motion.div>
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
            isTakingDamage={current.value === 'defending'}
            damageTaken={current.value === 'defending' ? context.player.damageTaken : null}
            name={context.player.name}
            level={context.player.level}
            stats={context.player.stats}
            artwork={context.player.artwork}
            inventory={inventory}
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
                isTakingDamage={current.value === 'attacking'}
                damageTaken={current.value === 'attacking' ? monster.damageTaken : null}
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

interface AnimatedBannerProps {
  children: any
}

function AnimatedBanner(props: AnimatedBannerProps) {
  return (
    <motion.div
      style={{ position: 'fixed', left: '50%', top: '50%', zIndex: 1 }}
      initial={{ y: '-75%', x: '-50%', scale: 0.5, opacity: 0 }}
      animate={{ y: '-50%', x: '-50%', scale: 1, opacity: 1 }}
      exit={{ y: '-50%', x: '-50%', scale: 0.85, opacity: 0 }}
    >
      <Banner>{props.children}</Banner>
    </motion.div>
  )
}
