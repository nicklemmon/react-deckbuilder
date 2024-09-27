import { useMachine } from '@xstate/react'
import { motion, AnimatePresence } from 'framer-motion'
import { appMachine } from './machines/app-machine/app-machine.ts'
import { type Card as CardType } from './types/cards.ts'
import coinsIcon from './images/gold-coins.png'
import { AppPreloader } from './components/app-preloader.tsx'
import { CharacterCreation } from './components/character-creation.tsx'
import { Avatar } from './components/avatar.tsx'
import { Card } from './components/card.tsx'
import { Deck } from './components/deck.tsx'
import { Dialog, DialogContent } from './components/dialog.tsx'
import { HealthBar } from './components/health-bar.tsx'
import { Feedback } from './components/feedback.tsx'
import { Stack } from './components/stack.tsx'
import { Inline } from './components/inline.tsx'
import { Button } from './components/button.tsx'
import { cardUseSound } from './machines/app-machine/app-machine.ts'
import { ItemShopCard, ItemShopStatus } from './components/item-shop-card.tsx'
import { StatsRow, StatIcon, StatVal } from './components/stats.tsx'
import './index.css'
import css from './app.module.css'

export function App() {
  const [{ context, value }, send] = useMachine(appMachine)

  if (value === 'LoadingAssets') {
    return <AppPreloader />
  }

  if (value === 'CharacterCreation') {
    return (
      <CharacterCreation
        onCreate={(formData) => {
          send({ type: 'CREATE_CHARACTER', data: formData })
        }}
      />
    )
  }

  return (
    <div className={css['play-area']}>
      <div className={css['play-area-wrapper']}>
        <div className={css['play-area-banner']}>
          <StatsRow className={css['card-stats-row']}>
            <StatIcon src={coinsIcon} />
            <StatVal>{context.game.player.gold}</StatVal>
          </StatsRow>
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
                      health={context.game.player.stats.health}
                      maxHealth={context.game.player.stats.maxHealth}
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

          <Stack spacing="100" align="center">
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
                      key={`monster-name-${context.game.monster?.id}`}
                      initial={{ x: 0, y: 0, scaleX: 0.9, opacity: 0 }}
                      animate={{ x: 0, y: 0, scaleX: 1, opacity: 1, transition: { delay: 0.25 } }}
                      exit={{
                        scaleX: 0.9,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className={css['monster-name-wrapper']}>
                        <div className={css['monster-name']}>{context.game.monster?.name}</div>
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
                      style={{ width: '100%' }}
                    >
                      <HealthBar
                        health={context.game.monster?.stats.health}
                        maxHealth={context.game.monster?.stats.maxHealth}
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
          <Stack align="center">
            <Inline>
              <Button onClick={() => send({ type: 'DESTROY_CARDS_CLICK' })} variant="tertiary">
                Destroy cards
              </Button>
              <Button onClick={() => send({ type: 'ITEM_SHOP_CLICK' })} variant="secondary">
                Item shop
              </Button>
              <Button onClick={() => send({ type: 'NEXT_BATTLE_CLICK' })}>Next battle</Button>
            </Inline>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={value === 'Shopping'}>
        <DialogContent>
          <Stack align="center" spacing="400">
            <Inline>
              {context.game.shop.cards.map((card) => {
                let status: ItemShopStatus = 'affordable'

                if (context.game.player.gold <= card.price) {
                  status = 'unaffordable'
                }

                if (context.game.player.deck.find((deckCard) => deckCard.id === card.id)) {
                  status = 'purchased'
                }

                return (
                  <ItemShopCard
                    key={`item-shop-${card.id}`}
                    shopStatus={status}
                    onClick={() => send({ type: 'BUY_CARD_CLICK', data: { card } })}
                    {...card}
                  />
                )
              })}
            </Inline>

            <Inline>
              {context.game.shop.items.map((item) => {
                return <div key={`item-${item.id}`}>{item.name}</div>
              })}
            </Inline>

            <Inline>
              <Button onClick={() => send({ type: 'LEAVE_SHOP_CLICK' })} variant="tertiary">
                Leave shop
              </Button>

              <Button onClick={() => send({ type: 'NEXT_BATTLE_CLICK' })}>Next battle</Button>
            </Inline>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  )
}
