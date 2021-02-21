import React from 'react'
import { SpawnedActorRef } from 'xstate'
import { useActor } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import player from 'src/config/player'
import {
  AttackStat,
  Card,
  Deck,
  DefenseStat,
  GoldStat,
  Monster,
  Player,
  Stats,
  StatusBar,
} from 'src/components'
import { PlayAreaEvent } from 'src/machines/playArea'
import { Card as CardInterface } from 'src/interfaces'
import {
  CardInPlay,
  DefeatBanner,
  DiscardPile,
  DrawPile,
  ShoppingModal,
  VictoryBanner,
} from './components'
import {
  BattleWrapper,
  CardInPlayWrapper,
  CurrentHandWrapper,
  DiscardPileWrapper,
  DrawPileWrapper,
  PlayAreaWrapper,
} from './PlayAreaStyles'

interface PlayAreaProps {
  machine: SpawnedActorRef<PlayAreaEvent>
}

export function PlayArea(props: PlayAreaProps) {
  const { machine } = props
  const [state, send] = useActor(machine)
  const { context } = state
  const inventory: any = context.player.inventory
  const cardInPlay: any = context.cardInPlay
  const monster: any = context.monster

  return (
    <PlayAreaWrapper>
      <StatusBar>
        <Stats>
          <Stats.Row>
            <GoldStat>{inventory.gold}</GoldStat>

            <AttackStat>{player.stats.attack}</AttackStat>

            <DefenseStat>{player.stats.defense}</DefenseStat>
          </Stats.Row>
        </Stats>
      </StatusBar>

      {state.value === 'shopping' && <ShoppingModal state={state} send={send} />}

      <AnimatePresence>
        {state.value === 'victory' || state.value === 'doneShopping' ? (
          <VictoryBanner send={send} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{state.value === 'defeat' && <DefeatBanner />}</AnimatePresence>

      <DrawPileWrapper>
        <DrawPile state={state} />
      </DrawPileWrapper>

      <CurrentHandWrapper>
        {context.currentHand && (
          <Deck isStacked={false}>
            {context.currentHand.map((card: CardInterface, index: number) => (
              <Card
                cardIndex={index}
                key={`current-hand-card-${index}`}
                onClick={() => send({ type: 'CHOOSE_CARD', card })}
                isDisabled={state.value !== 'choosing'}
                {...card}
              />
            ))}
          </Deck>
        )}
      </CurrentHandWrapper>

      <CardInPlayWrapper>
        <AnimatePresence>{cardInPlay && <CardInPlay state={state} />}</AnimatePresence>
      </CardInPlayWrapper>

      <BattleWrapper>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0 }}
        >
          <Player
            isTakingDamage={state.value === 'defending'}
            damageTaken={state.value === 'defending' ? context.player.damageTaken : null}
            goldAwarded={state.value === 'victory' ? context.spoils.gold : null}
            name={context.player.name}
            stats={context.player.stats}
            characterClass={context.player.characterClass}
            artwork={context.player.artwork}
            inventory={inventory}
          />
        </motion.div>

        <AnimatePresence>
          {monster && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 0, y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <Monster
                isTakingDamage={state.value === 'attacking'}
                damageTaken={state.value === 'attacking' ? monster.damageTaken : null}
                id={monster.id}
                name={monster.name}
                level={monster.level}
                goldBounty={monster.goldBounty}
                stats={monster.stats}
                artwork={monster.artwork}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </BattleWrapper>

      <DiscardPileWrapper>
        <DiscardPile state={state} />
      </DiscardPileWrapper>
    </PlayAreaWrapper>
  )
}
