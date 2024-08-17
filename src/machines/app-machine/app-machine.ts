import { assign, fromPromise, setup } from 'xstate'
import arrayShuffle from 'array-shuffle'
import { resolveModules } from '../../helpers/vite'
import { rng } from '../../helpers/rng'
import { MONSTERS } from '../../helpers/monsters'
import { CARDS, STARTING_DECK } from '../../helpers/cards'
import type { CharacterClass } from '../../types/character-classes'
import type { Monster } from '../../types/monsters'
import type { Card } from '../../types/cards'

/** Unique ID for the application machine */
const APP_MACHINE_ID = 'app'

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
type AppMachineContext = {
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

export const appMachine = setup({
  types: {
    context: {} as AppMachineContext,
    events: {} as {
      type: 'CREATE_CHARACTER'
      data: { characterClass: CharacterClass; characterName: string; characterPortrait: string }
    },
  },
  actions: {
    createDrawPile: assign({
      game: ({ context }) => {
        const newDrawPile = arrayShuffle(context.game.player.startingDeck).map((card) => {
          return {
            ...card,
            status: 'face-down',
          }
        })

        return {
          ...context.game,
          drawPile: newDrawPile,
        }
      },
    }),
    getNextMonster: assign({
      game: ({ context }) => {
        const shuffledMonsters = arrayShuffle(context.assets.monsters)
        const nextMonster = shuffledMonsters[rng(shuffledMonsters.length)]

        return {
          ...context.game,
          monster: {
            ...nextMonster,
            status: 'idle',
          },
        }
      },
    }),
  },
  actors: {
    loadAllAssets: fromPromise(prefetchAssets),
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
          target: 'PlayingGame',
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
    PlayingGame: {
      entry: ['getNextMonster', 'createDrawPile'],
    },
    Victory: {},
    Defeat: {},
  },
})
