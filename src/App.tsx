import { useMachine } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import { appMachine } from './machines/app-machine/app-machine.ts'
import { type Card as CardType } from './types/cards.ts'
import { AppPreloader } from './components/app-preloader.tsx'
import { CharacterCreation } from './components/character-creation.tsx'
import { Avatar } from './components/avatar.tsx'
import { HealthBar } from './components/health-bar.tsx'
import { Deck } from './components/deck.tsx'
import { Card } from './components/card.tsx'
import { Stack } from './components/stack.tsx'
import css from './app.module.css'
import './index.css'

export function App() {
  const [{ context, value }, send] = useMachine(appMachine)
  console.log('context.game.monster', context.game.monster)
  console.log('context.game.monster?.stats.maxHealth', context.game.monster?.stats.maxHealth)

  if (value === 'LoadingAssets') {
    return <AppPreloader />
  }

  if (value === 'CharacterCreation') {
    return (
      <CharacterCreation
        onCreate={(formData) => {
          console.log('formData', formData)
          send({ type: 'CREATE_CHARACTER', data: formData })
        }}
      />
    )
  }

  return (
    <div className={css['play-area']}>
      <div className={css['play-area-wrapper']}>
        <div className={css['play-area-debugger']}>
          Current state: <code>"{value}"</code>
        </div>

        <div className={css['combat-zone']}>
          <div className={css['character']}>
            <Stack spacing="200">
              {context.game.player.characterPortrait ? (
                <Avatar src={context.game.player.characterPortrait} />
              ) : null}

              {/* <HealthBar
                health={context.game.player.stats.health / context.game.player.stats.maxHealth}
              /> */}
            </Stack>
          </div>

          {context.game.monster ? (
            <div className={css['monster']}>
              <Stack spacing="200">
                {context.game.monster.artwork ? (
                  <Avatar src={context.game.monster.artwork} />
                ) : null}
                <HealthBar
                  health={context.game.monster.stats.health / context.game.monster.stats.maxHealth}
                />
              </Stack>
            </div>
          ) : null}
        </div>

        <Stack className={css['current-hand']}>
          <div className={css['current-hand-wrapper']}>
            {context.game.currentHand.map((card, index) => {
              return (
                <Card
                  {...card}
                  key={`current-hand-card-${card.id}-${index}`}
                  orientation="face-up"
                  status={context.game.cardInPlay !== undefined ? 'disabled' : card.status}
                  onClick={() => send({ type: 'PLAY_CARD', data: { card } })}
                />
              )
            })}
          </div>
        </Stack>

        <Stack className={css['discard-pile']}>
          <Deck>
            {context.game.discardPile.map((card, index) => {
              return (
                <Card
                  {...card}
                  key={`discard-pile-card-${card.id}-${index}`}
                  orientation="face-down"
                />
              )
            })}
          </Deck>
          <div>Discard pile</div>
        </Stack>

        <AnimatePresence>
          {context.game.cardInPlay ? (
            <motion.div
              style={{ position: 'absolute', left: '50%', bottom: 0, zIndex: 100 }}
              initial={{ y: 0, opacity: 0.25, x: '-50%', scale: 1 }}
              animate={{ y: '-25vh', opacity: 1, x: '-50%', scale: 1.1 }}
              exit={{ y: '0vh', x: '33vw', opacity: 0, rotate: 15, scale: 1 }}
              transition={{ type: 'spring', damping: 5, mass: 0.1, stiffness: 30 }}
              onAnimationComplete={() =>
                send({
                  type: 'CARD_IN_PLAY_ANIMATION_COMPLETE',
                  data: { card: context.game.cardInPlay as CardType },
                })
              }
            >
              <Card {...context.game.cardInPlay} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Stack className={css['draw-pile']}>
          <Deck>
            {context.game.drawPile.map((card, index) => {
              return (
                <Card
                  {...card}
                  key={`draw-pile-card-${card.id}-${index}`}
                  orientation="face-down"
                />
              )
            })}
          </Deck>
          <div>Draw pile</div>
        </Stack>
      </div>
    </div>
  )
}
