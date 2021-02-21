import { Player } from 'src/interfaces'

export interface AppStateSchema {
  states: {
    creatingCharacter: {}
    playing: {}
  }
}

export interface AppContext {
  player: Player
}
