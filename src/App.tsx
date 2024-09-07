import { useMachine } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import { appMachine } from './machines/app-machine/app-machine.ts'
import { type Card as CardType } from './types/cards.ts'
import { AppPreloader } from './components/app-preloader.tsx'
import { CharacterCreation } from './components/character-creation.tsx'
import { Avatar } from './components/avatar.tsx'
import { Card } from './components/card.tsx'
import { Deck } from './components/deck.tsx'
import { Dialog, DialogContent } from './components/dialog.tsx'
import { HealthBar } from './components/health-bar.tsx'
import { Feedback } from './components/feedback.tsx'
import { Stack } from './components/stack.tsx'
import css from './app.module.css'
import './index.css'
import { Button } from './components/button.tsx'
import { cardUseSound } from './machines/app-machine/app-machine.ts'

export function App() {
  const [{ context, value }, send] = useMachine(appMachine)

  if (value === 'LoadingAssets') {
    return (
      <>
        <div className={css['play-area-debugger']}>
          Current state: <code>{JSON.stringify(value)}</code>
        </div>
        <AppPreloader />
      </>
    )
  }

  if (value === 'CharacterCreation') {
    return (
      <>
        <div className={css['play-area-debugger']}>
          Current state: <code>{JSON.stringify(value)}</code>
        </div>
        <CharacterCreation
          onCreate={(formData) => {
            console.log('formData', formData)
            send({ type: 'CREATE_CHARACTER', data: formData })
          }}
        />
      </>
    )
  }

  return (
    <div className={css['play-area']}>
      <div className={css['play-area-wrapper']}>
        <div className={css['play-area-debugger']}>
          Current state: <code>{JSON.stringify(value)}</code>
        </div>

        <div className={css['combat-zone']}>
          <AnimatePresence>
            {context.game.player.characterPortrait ? (
              <motion.div
                key={`character-${context.game.player.characterName}`}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ x: 0, y: 0, opacity: 0 }}
                transition={{ duration: 0.33 }}
              >
                <div className={css['character']}>
                  <Stack spacing="200">
                    {context.game.player.characterPortrait ? (
                      <Avatar
                        src={context.game.player.characterPortrait}
                        status={context.game.player.status}
                      />
                    ) : null}

                    <HealthBar
                      health={
                        context.game.player.stats.health / context.game.player.stats.maxHealth
                      }
                    />

                    {value === 'Defending' ? (
                      <Feedback
                        variant="negative"
                        onAnimationComplete={() =>
                          send({ type: 'MONSTER_ATTACK_ANIMATION_COMPLETE' })
                        }
                      >
                        {/* TODO: This is the wrong value! */}
                        {context.game.monster?.stats.attack}
                      </Feedback>
                    ) : null}
                  </Stack>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Stack>
            <AnimatePresence
              onExitComplete={() => send({ type: 'MONSTER_DEATH_ANIMATION_COMPLETE' })}
            >
              {context.game.monster
                ? [
                    <motion.div
                      key={`monster-${context.game.monster.id}`}
                      initial={{ x: 50, y: 0, opacity: 0, filter: 'grayscale(0)' }}
                      animate={{ x: 0, y: 0, opacity: 1, filter: 'grayscale(0)' }}
                      exit={{
                        x: 0,
                        y: 50,
                        opacity: 0,
                        filter: 'grayscale(1)',
                        transition: { delay: 0.33, duration: 0.66 },
                      }}
                      transition={{ duration: 0.33 }}
                    >
                      <div className={css['monster']}>
                        <Stack spacing="200">
                          {context.game.monster.artwork ? (
                            <Avatar
                              src={context.game.monster.artwork}
                              status={context.game.monster.status}
                            />
                          ) : null}

                          {value === 'ApplyingCardEffects' ? (
                            <Feedback
                              variant="negative"
                              onAnimationComplete={() =>
                                send({ type: 'CARD_EFFECTS_ANIMATION_COMPLETE' })
                              }
                            >
                              {context.game.cardInPlay?.stats.attack}
                            </Feedback>
                          ) : null}
                        </Stack>
                      </div>
                    </motion.div>,

                    <motion.div
                      key={`health-bar-${context.game.monster?.id}`}
                      initial={{ x: 0, y: -25, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1, transition: { delay: 0.25 } }}
                      exit={{
                        scale: 0.9,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <HealthBar
                        health={
                          context.game?.monster?.stats?.health /
                            context?.game.monster?.stats?.maxHealth ?? 0
                        }
                      />
                    </motion.div>,
                  ]
                : null}
            </AnimatePresence>
          </Stack>
        </div>

        <Stack className={css['current-hand']}>
          <Stack spacing="100">
            <div className={css['current-hand-wrapper']}>
              {context.game.currentHand.map((card, index) => {
                return (
                  <motion.div
                    layout
                    key={`current-hand-card-${card.id}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onAnimationStart={() => {
                      setTimeout(() => {
                        cardUseSound.play()
                      }, index * 100)
                    }}
                  >
                    <Card
                      {...card}
                      orientation="face-up"
                      status={context.game.cardInPlay !== undefined ? 'disabled' : card.status}
                      onClick={() => send({ type: 'PLAY_CARD', data: { card } })}
                    />
                  </motion.div>
                )
              })}
            </div>
            Current hand with {context.game.currentHand.length} cards
          </Stack>
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
          <div>Discard pile with {context.game.discardPile.length} cards</div>
        </Stack>

        <AnimatePresence
          onExitComplete={() => send({ type: 'DISCARD_CARD_ANIMATION_COMPLETE' })}
          mode="popLayout"
        >
          {context.game.cardInPlay ? (
            <motion.div
              key={`card-in-play-${context.game.cardInPlay.id}`}
              style={{ position: 'absolute', left: '50%', bottom: 0, zIndex: 100 }}
              initial={{ y: 0, opacity: 0.25, x: '-50%', scale: 1 }}
              animate={{ y: '-33vh', opacity: 1, x: '-50%', scale: 1.25 }}
              exit={{ x: '50vh', opacity: 0, rotate: 15, scale: 1 }}
              transition={{ type: 'spring', damping: 5, mass: 0.1, stiffness: 30 }}
              onAnimationComplete={() =>
                send({
                  type: 'PLAY_CARD_ANIMATION_COMPLETE',
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
          <div>Draw pile with {context.game.drawPile.length} cards</div>
        </Stack>
      </div>

      <Dialog open={value === 'BetweenRounds'}>
        <DialogContent>
          <Button onClick={() => send({ type: 'NEXT_BATTLE_CLICK' })}>Next battle</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
