import { assign, fromPromise, createMachine } from 'xstate'
import type { CharacterClass } from '../types/character-classes'
import { resolveModules } from '../helpers/vite'
import { MONSTERS } from '../helpers/monsters'
import { CARDS } from '../helpers/cards'

/** Unique ID for the application machine */
export const APP_MACHINE_ID = 'app'

/** All image files in the project */
const IMAGE_MODULES = import.meta.glob('../**/**/*.(png|webp)', { eager: true })

/** All sound effect files in the project */
const SFX_MODULES = import.meta.glob('../**/**/*.wav', { eager: true })

/** All character class config files in the project */
const CHARACTER_CLASS_MODULES = import.meta.glob('../character-classes/**/config.ts', {
  eager: true,
})

/* Resolved character class configs */
const CHARACTER_CLASSES = resolveModules<CharacterClass>(CHARACTER_CLASS_MODULES)

/** Prefetches assets from multiple sources returned by `import.meta.glob` */
export async function prefetchAssets() {
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

/** Defines an actor for invocation by the app machine */
const loadAllAssetsActor = fromPromise(prefetchAssets)

export const appMachine = createMachine({
  id: APP_MACHINE_ID,
  initial: 'LoadingAssets',
  context: {
    characterClasses: CHARACTER_CLASSES,
    monsters: MONSTERS,
    cards: CARDS,
    player: {
      characterClass: undefined,
      characterName: undefined,
      characterPortrait: undefined,
    },
  },
  states: {
    LoadingAssets: {
      invoke: {
        src: loadAllAssetsActor,
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
            player: ({ event }) => {
              return {
                characterClass: event.characterClass,
                characterName: event.characterName,
                characterPortrait: event.characterPortrait,
              }
            },
          }),
        },
      },
    },
    PlayingGame: {
      on: {},
    },
    Victory: {},
    Defeat: {},
  },
})
