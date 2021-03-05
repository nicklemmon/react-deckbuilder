import React from 'react'
import { SpawnedActorRef } from 'xstate'
import { useActor } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Deck, GoldStat, Monster, Player, Stats, StatusBar } from 'src/components'
import { AvatarStatus } from 'src/components/Avatar/types'
import { PlayAreaEvent } from 'src/machines/playArea'
import { Card as CardInterface, Item as ItemInterface } from 'src/interfaces'
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
          </Stats.Row>
        </Stats>

        {inventory.items.map((item: ItemInterface, index: number) => (
          <StatusBar.Button
            key={`item-${item.id}-${index}`}
            onClick={() => send({ type: 'CHOOSE_ITEM', item })}
            status={state.value !== 'choosing' ? 'disabled' : 'idle'}
          >
            <StatusBar.ButtonImg alt={item.name} src={item.artwork} />
          </StatusBar.Button>
        ))}
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
                {...card}
                cardIndex={index}
                key={`current-hand-card-${index}`}
                onClick={() => send({ type: 'CHOOSE_CARD', card })}
                isDisabled={state.value !== 'choosing'}
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
            status={getPlayerAvatarStatus(state.value)}
            damageTaken={state.value === 'defending' ? context.player.damageTaken : null}
            healingAmount={state.value === 'healing' ? context.player.healingAmount : null}
            goldAwarded={state.value === 'victory' ? context.spoils.gold : null}
            name={context.player.name}
            stats={context.player.stats}
            characterClass={context.player.characterClass}
            characterPortrait={context.player.characterPortrait}
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
                status={
                  state.value === 'attacking' ? AvatarStatus['takingDamage'] : AvatarStatus['idle']
                }
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

/**
 * @description determines the player avatar status according to the current status of the state machine
 */
function getPlayerAvatarStatus(stateMachineValue: string): AvatarStatus {
  console.log('stateMachineValue', stateMachineValue)
  switch (stateMachineValue) {
    case 'defending': {
      return AvatarStatus['takingDamage']
    }

    case 'healing': {
      return AvatarStatus['healing']
    }

    default: {
      return AvatarStatus['idle']
    }
  }
}
