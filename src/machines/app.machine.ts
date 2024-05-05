import { assign, fromPromise, createMachine } from 'xstate'

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
const CHARACTER_CLASSES = resolveModules(CHARACTER_CLASS_MODULES)

console.log('CHARACTER_CLASSES', CHARACTER_CLASSES)

/**
 * Helper function to return eagerly resolved modules.
 * @param modules - The return value of import.meta.glob with eager loading enabled.
 * @returns An object containing the resolved modules.
 */
function resolveModules(modules: Record<string, any>) {
  const result: Array<any> = []

  // Loop through each module entry and assign the default export to the result.
  for (const [_path, module] of Object.entries(modules)) {
    result.push(module.default || module) // Handle cases where there's no default export
  }

  return result
}

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

const loadAllAssetsActor = fromPromise(prefetchAssets)

export const appMachine = createMachine({
  id: APP_MACHINE_ID,
  initial: 'LoadingAssets',
  context: {
    characterClasses: CHARACTER_CLASSES,
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
