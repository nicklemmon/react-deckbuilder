import { Machine, assign } from 'xstate'
import config from '../../config'
import {
  CharacterCreationMachine,
  CHARACTER_CREATION_MACHINE_ID,
} from '../../machines/characterCreation'
import {
  PlayAreaMachine,
  PLAY_AREA_MACHINE_ID,
  PLAY_AREA_MACHINE_DEFAULT_CONTEXT,
} from '../../machines/playArea'
import { APP_MACHINE_ID } from './constants'
import { AppContext, AppStateSchema } from './types'

export const AppMachine = Machine<AppContext, AppStateSchema>({
  id: APP_MACHINE_ID,
  initial: 'creatingCharacter',
  context: {
    player: config.player,
  },
  states: {
    // TODO: Eventually incorporate saved game loading from local storage
    creatingCharacter: {
      invoke: {
        id: CHARACTER_CREATION_MACHINE_ID,
        src: CharacterCreationMachine,
        onDone: {
          target: 'playing',
          actions: assign({
            player: (context: AppContext, event) => {
              return {
                ...context.player,
                ...event.data.player,
              }
            },
          }),
        },
      },
    },
    playing: {
      invoke: {
        id: PLAY_AREA_MACHINE_ID,
        src: PlayAreaMachine,
        data: {
          ...PLAY_AREA_MACHINE_DEFAULT_CONTEXT,
          player: (context: AppContext) => {
            return context.player
          },
        },
      },
    },
  },
})
