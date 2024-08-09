import { assign } from 'xstate'
import { rng } from '../../helpers/rng'
import { MONSTERS } from './constants'

/** Gets/sets a new monster to game context randomly */
export function getNextMonster() {
  const nextMonster = MONSTERS[rng(MONSTERS.length)]

  // TODO: Should this be moved to the state machine or a separate function?
  nextMonster.sfx?.intro.play()

  return assign((ctx) => {
    return {
      monster: {
        ...nextMonster,
        status: 'idle',
      },
    }
  })
}

/** Creates a draw pile */
export function createDrawPile() {}
