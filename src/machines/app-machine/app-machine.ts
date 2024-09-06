import { assign, fromPromise, setup } from 'xstate'
import arrayShuffle from 'array-shuffle'
import impactSfx from '../../sfx/impact.slice.wav'
import cardUseSfx from '../../sfx/card.use.wav'
import buttonClickSfx from '../../sfx/button.click.wav'
import { resolveModules } from '../../helpers/vite.ts'
import { rng } from '../../helpers/rng.ts'
import { getSound } from '../../helpers/get-sound.ts'
import { MONSTERS } from '../../helpers/monsters.ts'
import { CARDS, STARTING_DECK } from '../../helpers/cards.ts'
import type { CharacterClass } from '../../types/character-classes.ts'
import type { Monster } from '../../types/monsters.ts'
import type { Card } from '../../types/cards.ts'
import { AvatarStatus } from '../../components/avatar.tsx'

/** Unique ID for the application machine */
const APP_MACHINE_ID = 'app'

/** THe maximum number of allowed cards in the `currentHand` */
const MAX_HAND_SIZE = 7

/** All image files in the project */
const IMAGE_MODULES = import.meta.glob('../**/**/*.(png|webp)', { eager: true })

/** All sound effect files in the project */
const SFX_MODULES = import.meta.glob('../**/**/*.wav', { eager: true })

/** All character class config files in the project */
const CHARACTER_CLASS_MODULES = import.meta.glob('../../character-classes/**/config.ts', {
  eager: true,
})

/* Resolved character class configs */
const CHARACTER_CLASSES = resolveModules<CharacterClass>(CHARACTER_CLASS_MODULES)

const impactSound = getSound({ src: impactSfx })

const cardUseSound = getSound({ src: cardUseSfx })

const buttonClickSound = getSound({ src: buttonClickSfx, volume: 0.5 })

/** Prefetches assets from multiple sources returned by `import.meta.glob` */
async function prefetchAssets() {
  return Promise.all([
    ...Object.values(IMAGE_MODULES).map((module: any) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(null)
        img.src = module.default
      })
    }),
    ...Object.values(SFX_MODULES).map((module: any) => {
      return new Promise((resolve) => {
        const audio = new Audio()
        audio.oncanplaythrough = () => resolve(null)
        audio.src = module.default
      })
    }),
  ])
}

/** Context for the app-machine */
export type AppMachineContext = {
  assets: {
    characterClasses: Array<CharacterClass>
    monsters: Array<Monster>
    cards: Array<Card>
  }
  game: {
    player: {
      characterClass: CharacterClass | undefined
      characterName: string | undefined
      characterPortrait: string | undefined
      startingDeck: Array<Card>
      deck: Array<Card>
      status: AvatarStatus
      stats: {
        maxHealth: number
        health: number
        defense: number
      }
    }
    shop: {
      cards: Array<Card>
      // TODO: Update type for item
      items: Array<any>
    }
    currentHand: Array<Card>
    discardPile: Array<Card>
    drawPile: Array<Card>
    // TODO: Update type for item
    chosenItem?: any
    cardInPlay?: Card
    cardToDestroy?: Card
    monster?: Monster
  }
}

type AppMachineEvent =
  | {
      type: 'CREATE_CHARACTER'
      data: { characterClass: CharacterClass; characterName: string; characterPortrait: string }
    }
  | {
      type: 'PLAY_CARD'
      data: { card: Card }
    }
  | {
      type: 'PLAY_CARD_ANIMATION_COMPLETE'
      data: { card: Card }
    }
  | { type: 'CARD_EFFECTS_ANIMATION_COMPLETE' }
  | { type: 'PLAY_CARD_ANIMATION_COMPLETE' }
  | { type: 'DISCARD_CARD_ANIMATION_COMPLETE' }
  | { type: 'MONSTER_DEATH_ANIMATION_COMPLETE' }
  | { type: 'MONSTER_ATTACK_ANIMATION_COMPLETE' }
  | { type: 'NEXT_BATTLE_CLICK' }

export const appMachine = setup({
  types: {
    context: {} as AppMachineContext,
    events: {} as AppMachineEvent,
  },
  actions: {
    applyCardEffects: assign({
      game: ({ context }) => {
        context.game?.monster?.sfx?.damage.play()
        impactSound.play()

        if (!context.game.monster || !context.game.cardInPlay) {
          return context.game
        }

        return {
          ...context.game,
          monster: {
            ...context.game.monster,
            status: 'taking-damage' as const,
            stats: {
              ...context.game.monster.stats,
              health: context.game.monster?.stats.health - context.game.cardInPlay?.stats.attack,
            },
          },
        }
      },
    }),
    createDrawPile: assign({
      game: ({ context }) => {
        const newDrawPile = arrayShuffle(context.game.player.startingDeck).map((card) => {
          return {
            ...card,
            id: `${card.id}-${crypto.randomUUID()}`,
            orientation: 'face-down' as const,
          }
        })

        return {
          ...context.game,
          discardPile: [],
          drawPile: newDrawPile,
        }
      },
    }),
    getNextMonster: assign({
      game: ({ context }) => {
        const shuffledMonsters = arrayShuffle(context.assets.monsters)
        const nextMonster = shuffledMonsters[rng(shuffledMonsters.length)]

        nextMonster.sfx?.intro.play()

        return {
          ...context.game,
          monster: {
            ...nextMonster,
            id: `${nextMonster.id}-${crypto.randomUUID()}`,
            stats: {
              ...nextMonster.stats,
              health: nextMonster.stats.maxHealth,
            },
            status: 'idle' as const,
          },
        }
      },
    }),
    reshuffle: assign({
      game: ({ context }) => {
        const nextDrawPile = arrayShuffle([
          ...context.game.currentHand,
          ...context.game.discardPile,
        ])

        return {
          ...context.game,
          currentHand: [],
          discardPile: [],
          drawPile: nextDrawPile,
        }
      },
    }),
    drawHand: assign({
      game: ({ context }) => {
        const drawPile = context.game.drawPile
        const drawnCards = drawPile.slice(0, 3)
        const remainingCards = drawPile.slice(3)
        const currentHand = context.game.currentHand.concat(
          drawnCards.map((card) => ({
            ...card,
            orientation: 'face-up',
          })),
        )

        return {
          ...context.game,
          currentHand,
          drawPile: remainingCards,
        }
      },
    }),
    discardCurrentHand: assign({
      game: ({ context }) => {
        return {
          ...context.game,
          currentHand: [],
        }
      },
    }),
    monsterAttack: assign({
      game: ({ context }) => {
        if (!context.game.monster) return context.game

        const rawDamage = context.game.monster.stats.attack - context.game.player.stats.defense
        const damage = rawDamage > 0 ? rawDamage : 0
        impactSound.play()

        return {
          ...context.game,
          player: {
            ...context.game.player,
            status: 'taking-damage' as const,
            stats: {
              ...context.game.player.stats,
              health: context.game.player.stats.health - damage,
            },
          },
        }
      },
    }),
    awardSpoils: () => {},
    stockShop: () => {},
  },
  actors: {
    loadAllAssets: fromPromise(prefetchAssets),
  },
  guards: {
    playerIsAlive: ({ context }) => {
      return context.game.player.stats.health > 0
    },
    playerIsDead: ({ context }) => {
      return context.game.player.stats.health <= 0
    },
    monsterIsAlive: ({ context }) => {
      if (!context.game.monster) return false

      return context.game.monster.stats.health > 0
    },
    monsterIsDead: ({ context }) => {
      if (!context.game.monster) return false

      return context.game.monster.stats.health <= 0
    },
    playerCanDraw: ({ context }) => {
      return context.game.drawPile.length > 0 && context.game.currentHand.length < MAX_HAND_SIZE
    },
    playerCannotDraw: ({ context }) => {
      return context.game.drawPile.length === 0
    },
    drawingNotNeeded: ({ context }) => {
      return context.game.drawPile.length === 0 && context.game.currentHand.length === MAX_HAND_SIZE
    },
  },
}).createMachine({
  id: APP_MACHINE_ID,
  initial: 'LoadingAssets',
  context: {
    assets: {
      characterClasses: CHARACTER_CLASSES,
      monsters: MONSTERS,
      cards: CARDS,
    },
    game: {
      player: {
        characterClass: undefined,
        characterName: undefined,
        characterPortrait: undefined,
        startingDeck: STARTING_DECK,
        deck: [],
        status: 'idle' as const,
        stats: {
          // TODO: Update with character class stats
          maxHealth: 100,
          health: 100,
          defense: 0,
        },
      },
      shop: {
        cards: [],
        items: [],
      },
      currentHand: [],
      discardPile: [],
      drawPile: [],
    },
  },
  states: {
    LoadingAssets: {
      invoke: {
        src: 'loadAllAssets',
        onDone: 'CharacterCreation',
        onError: 'LoadingAssetsError',
      },
    },
    LoadingAssetsError: {},
    CharacterCreation: {
      on: {
        CREATE_CHARACTER: {
          target: 'NewRound',
          actions: assign({
            game: (args) => {
              const { context, event } = args

              return {
                ...context.game,
                player: {
                  ...context.game.player,
                  characterClass: event.data.characterClass,
                  characterName: event.data.characterName,
                  characterPortrait: event.data.characterPortrait,
                },
              }
            },
          }),
        },
      },
    },
    NewRound: {
      entry: ['discardCurrentHand', 'getNextMonster', 'createDrawPile'],
      always: ['Surveying'],
    },
    Surveying: {
      // Resets player status to idle
      entry: assign({
        game: ({ context }) => ({
          ...context.game,
          player: { ...context.game.player, status: 'idle' as const },
        }),
      }),
      always: [
        {
          target: 'PlayerChoosing',
          guard: 'drawingNotNeeded',
        },
        {
          target: 'Drawing',
          guard: 'playerCanDraw',
        },
        {
          target: 'Reshuffling',
          guard: 'playerCannotDraw',
        },
      ],
    },
    Reshuffling: {
      entry: 'reshuffle',
      always: 'Drawing',
    },
    Drawing: {
      entry: ['drawHand'],
      always: 'PlayerChoosing',
    },
    PlayerChoosing: {
      on: {
        PLAY_CARD: {
          target: 'CardInPlay',
          actions: assign({
            game: ({ context, event }) => {
              cardUseSound.play()

              // TODO: Need to have a slight delay here
              event.data.card?.sfx?.play()

              return {
                ...context.game,
                // Remove the selected card from the current hand
                currentHand: context.game.currentHand.filter(
                  (card) => card.id !== event.data.card.id,
                ),
                cardInPlay: {
                  ...event.data.card,
                  orientation: 'face-up' as const,
                  status: 'in-play' as const,
                },
              }
            },
          }),
        },
      },
      entry: assign({
        game: ({ context }) => {
          if (!context.game.monster) {
            return context.game
          }

          return {
            ...context.game,
            monster: {
              ...context.game.monster,
              status: 'idle' as const,
            },
          }
        },
      }),
    },
    CardInPlay: {
      on: {
        PLAY_CARD_ANIMATION_COMPLETE: {
          target: 'ApplyingCardEffects',
        },
      },
    },
    ApplyingCardEffects: {
      entry: 'applyCardEffects',
      on: {
        CARD_EFFECTS_ANIMATION_COMPLETE: {
          target: 'CardPlayed',
        },
      },
    },
    CardPlayed: {
      entry: assign({
        game: ({ context }) => {
          // Should be an impossible state, but need to keep TypeScript happy
          if (!context.game.monster) {
            return {
              ...context.game,
              cardInPlay: undefined,
              discardPile: [
                ...context.game.discardPile,
                {
                  ...(context.game?.cardInPlay as Card),
                  status: 'idle',
                },
              ],
            }
          }

          return {
            ...context.game,
            cardInPlay: undefined,
            monster: {
              ...context.game.monster,
              status: 'idle' as const,
            },
            discardPile: [
              ...context.game.discardPile,
              {
                ...(context.game?.cardInPlay as Card),
                status: 'idle',
              },
            ],
          }
        },
      }),
      always: [
        {
          target: 'Victory',
          guard: 'monsterIsDead',
          actions: assign({
            game: ({ context }) => {
              // Should be an impossible state, but need to keep TypeScript happy
              if (!context.game.monster) {
                return context.game
              }

              context.game.monster.sfx?.death.play()

              return {
                ...context.game,
                monster: undefined,
              }
            },
          }),
        },
        {
          target: 'Defending',
          guard: 'monsterIsAlive',
        },
      ],
    },
    Defending: {
      entry: 'monsterAttack',
      on: {
        MONSTER_ATTACK_ANIMATION_COMPLETE: [
          {
            target: 'Surveying',
            guard: 'playerIsAlive',
          },
          {
            target: 'Defeat',
            guard: 'playerIsDead',
          },
        ],
      },
    },
    Victory: {
      entry: ['awardSpoils', 'stockShop'],
      on: {
        MONSTER_DEATH_ANIMATION_COMPLETE: {
          target: 'BetweenRounds',
        },
      },
    },
    BetweenRounds: {
      on: {
        NEXT_BATTLE_CLICK: {
          target: 'NewRound',
          actions: () => buttonClickSound.play(),
        },
      },
    },
    Defeat: {},
  },
})
