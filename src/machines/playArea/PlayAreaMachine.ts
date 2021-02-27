import { Machine } from 'xstate'
import { PLAY_AREA_MACHINE_ID, PLAY_AREA_MACHINE_DEFAULT_CONTEXT } from './constants'
import { PlayAreaStateSchema, PlayAreaEvent, PlayAreaContext } from './types'
import {
  awardSpoils,
  buyCard,
  buyItem,
  createDrawPile,
  drawHand,
  getNewMonster,
  killMonster,
  monsterAttack,
  playerAttack,
  playCard,
  prepareNextBattle,
  reshuffle,
  stockShop,
} from './actions'
import {
  playerIsAlive,
  playerIsDead,
  monsterIsAlive,
  monsterIsDead,
  playerCanDraw,
  drawingIsNotNeeded,
  playerCannotDraw,
} from './guards'

export const PlayAreaMachine = Machine<PlayAreaContext, PlayAreaStateSchema, PlayAreaEvent>({
  id: PLAY_AREA_MACHINE_ID,
  initial: 'newRound',
  context: PLAY_AREA_MACHINE_DEFAULT_CONTEXT,
  states: {
    newRound: {
      entry: [createDrawPile, getNewMonster],
      after: {
        300: 'surveying',
      },
    },
    surveying: {
      after: [
        { delay: 300, target: 'reshuffling', cond: playerCannotDraw },
        { delay: 300, target: 'drawing', cond: playerCanDraw },
        { delay: 300, target: 'choosing', cond: drawingIsNotNeeded },
      ],
    },
    reshuffling: {
      entry: reshuffle,
      after: {
        300: 'drawing',
      },
    },
    drawing: {
      entry: drawHand,
      after: {
        300: 'choosing',
      },
    },
    choosing: {
      on: {
        CHOOSE_CARD: {
          actions: playCard,
          target: 'playing',
        },
      },
    },
    playing: {
      after: {
        800: 'attacking',
      },
    },
    attacking: {
      entry: playerAttack,
      after: [
        { delay: 800, target: 'defending', cond: monsterIsAlive },
        { delay: 800, target: 'victory', cond: monsterIsDead },
      ],
    },
    defending: {
      entry: monsterAttack,
      after: [
        { delay: 800, target: 'surveying', cond: playerIsAlive },
        { delay: 800, target: 'defeat', cond: playerIsDead },
      ],
    },
    victory: {
      entry: [awardSpoils, killMonster, stockShop],
      on: {
        NEXT_BATTLE_CLICK: {
          actions: prepareNextBattle,
          target: 'newRound',
        },
        ITEM_SHOP_CLICK: {
          target: 'shopping',
        },
      },
    },
    shopping: {
      on: {
        LEAVE_SHOP_CLICK: {
          target: 'doneShopping',
        },
        NEW_CARD_CLICK: {
          actions: buyCard,
        },
        NEW_ITEM_CLICK: {
          actions: buyItem,
        },
        NEXT_BATTLE_CLICK: {
          actions: prepareNextBattle,
          target: 'newRound',
        },
      },
    },
    doneShopping: {
      on: {
        NEXT_BATTLE_CLICK: {
          actions: prepareNextBattle,
          target: 'newRound',
        },
        ITEM_SHOP_CLICK: {
          target: 'shopping',
        },
      },
    },
    defeat: {},
  },
})
