import { Machine, assign } from 'xstate'
import { Card, Player } from 'src/interfaces'
import config from 'src/config'
import { CharacterCreationMachine, CHARACTER_CREATION_MACHINE_ID } from './CharacterCreationMachine'
import { GameMachine, GAME_MACHINE_ID, GAME_MACHINE_DEFAULT_CONTEXT } from './GameMachine'

export const APP_MACHINE_ID = 'app-machine'

interface AppStateSchema {
  states: {
    creatingCharacter: {}
    playing: {}
  }
}

interface AppContext {
  player: Player
}

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
        id: GAME_MACHINE_ID,
        src: GameMachine,
        data: {
          ...GAME_MACHINE_DEFAULT_CONTEXT,
          player: (context: AppContext) => {
            return context.player
          },
        },
      },
    },
  },
})
