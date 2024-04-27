import { fromPromise } from 'xstate'
import { createMachine } from 'xstate'

export const APP_MACHINE_ID = 'app'

const IMAGE_MODULES = import.meta.glob('../**/**/*.png', { eager: true })

const SFX_MODULES = import.meta.glob('../**/**/*.wav', { eager: true })

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
  states: {
    LoadingAssets: {
      invoke: {
        src: loadAllAssetsActor,
        onDone: 'CharacterCreation',
        onError: 'LoadingAssetsError',
      },
    },
    LoadingAssetsError: {},
    CharacterCreation: {},
    Game: {},
  },
})
