import { SpawnedActorRef } from 'xstate'
import { useActor } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Deck, GoldStat, Monster, Player, Stats, StatusBar } from '../../components'
import { AvatarStatus } from '../../components/Avatar/types'
import { PlayAreaEvent } from '../../machines/playArea'
import { Card as CardInterface, CardStatus, Item as ItemInterface } from '../../interfaces'
import {
  CardDestructionModal,
  CardInPlay,
  CardToDestroy,
  DefeatBanner,
  DiscardPile,
  DrawPile,
  ShoppingModal,
  VictoryBanner,
} from './components'
import {
  BattleWrapper,
  CenteredCard,
  PlayAreaContent,
  CurrentHandWrapper,
  DiscardPileWrapper,
  DrawPileWrapper,
  PlayAreaWrapper,
} from './styles'

interface PlayAreaProps {
  machine: SpawnedActorRef<PlayAreaEvent>
}

export function PlayArea(props: PlayAreaProps) {
  const { machine } = props
  const [state, send] = useActor(machine)
  const { context } = state
  const inventory = context.player.inventory
  const cardInPlay = context.cardInPlay
  const cardToDestroy = context.cardToDestroy
  const monster = context.monster

  return (
    <PlayAreaWrapper>
      <PlayAreaContent>
        <StatusBar>
          <Stats>
            <Stats.Row>
              <GoldStat>{inventory.gold}</GoldStat>
            </Stats.Row>
          </Stats>

          <StatusBar.Items>
            {inventory.items.map((item: ItemInterface, index: number) => (
              <StatusBar.Button
                key={`item-${item.id}-${index}`}
                onClick={() => send({ type: 'CHOOSE_ITEM', item })}
                status={state.value !== 'choosing' ? 'disabled' : 'idle'}
              >
                <StatusBar.ButtonImg alt={item.name} src={item.artwork} />
              </StatusBar.Button>
            ))}
          </StatusBar.Items>
        </StatusBar>

        {state.value === 'shopping' ? (
          <ShoppingModal
            itemShop={state.context.itemShop}
            onNewCardClick={(card: CardInterface) => send({ type: 'NEW_CARD_CLICK', card })}
            onNewItemClick={(item: ItemInterface) => send({ type: 'NEW_ITEM_CLICK', item })}
            onNextBattleClick={() => send({ type: 'NEXT_BATTLE_CLICK' })}
            onLeaveShopClick={() => send({ type: 'LEAVE_SHOP_CLICK' })}
          />
        ) : null}

        {state.matches('destroyingCards') || state.matches('destroyingCard') ? (
          <CardDestructionModal
            playerDeck={state.context.playerDeck}
            onDestroyClick={(card: CardInterface) => send({ type: 'CARD_TO_DESTROY_CLICK', card })}
            onNextBattleClick={() => send({ type: 'NEXT_BATTLE_CLICK' })}
            onCancelClick={() => send({ type: 'STOP_DESTROYING_CLICK' })}
            disabled={state.value === 'destroyingCard'}
          />
        ) : null}

        <CenteredCard>
          <AnimatePresence>
            {cardToDestroy && <CardToDestroy cardToDestroy={cardToDestroy} />}
          </AnimatePresence>
        </CenteredCard>

        <AnimatePresence>
          {state.value === 'betweenRounds' ? <VictoryBanner send={send} /> : null}
        </AnimatePresence>

        <AnimatePresence>{state.value === 'defeat' && <DefeatBanner />}</AnimatePresence>

        <DrawPileWrapper>
          {/* TODO: Just pass the draw pile rather than the whole state object */}
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
                  status={
                    state.value !== 'choosing' ? CardStatus['disabled'] : CardStatus['face-up']
                  }
                />
              ))}
            </Deck>
          )}
        </CurrentHandWrapper>

        <CenteredCard>
          <AnimatePresence>{cardInPlay && <CardInPlay state={state} />}</AnimatePresence>
        </CenteredCard>

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
                    state.value === 'attacking'
                      ? AvatarStatus['takingDamage']
                      : AvatarStatus['idle']
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
          {/* TODO: Just pass the discard pile rather than the whole state object */}
          <DiscardPile state={state} />
        </DiscardPileWrapper>
      </PlayAreaContent>
    </PlayAreaWrapper>
  )
}

/**
 * @description determines the player avatar status according to the current status of the state machine
 */
function getPlayerAvatarStatus(stateMachineValue: string): AvatarStatus {
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
