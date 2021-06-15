import { Machine } from 'xstate'
import { PLAY_AREA_MACHINE_ID, PLAY_AREA_MACHINE_DEFAULT_CONTEXT } from './constants'
import { PlayAreaStateSchema, PlayAreaEvent, PlayAreaContext } from './types'
import {
  awardSpoils,
  buyCard,
  buyItem,
  createDrawPile,
  destroyCard,
  disableUnaffordableCards,
  disableUnaffordableItems,
  drawHand,
  getNewMonster,
  killMonster,
  monsterAttack,
  playerAttack,
  playCard,
  playShopEntrySfx,
  prepareNextBattle,
  resetPlayerDeckStatuses,
  reshuffle,
  stockShop,
  useItem,
  healPlayer,
} from './actions'
import {
  monsterIsAlive,
  monsterIsDead,
  playerIsDead,
  playerIsAlive,
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
        CHOOSE_ITEM: {
          actions: useItem,
          target: 'usingItem',
        },
        CHOOSE_CARD: {
          actions: playCard,
          target: 'playing',
        },
      },
    },
    usingItem: {
      after: {
        300: 'healing',
      },
    },
    healing: {
      entry: healPlayer,
      after: {
        800: 'choosing',
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
      always: 'betweenRounds',
    },
    enteringShop: {
      entry: playShopEntrySfx,
      always: 'shopping',
    },
    shopping: {
      entry: disableUnaffordableItems,
      on: {
        LEAVE_SHOP_CLICK: {
          target: 'betweenRounds',
        },
        NEW_CARD_CLICK: {
          actions: buyCard,
          target: 'takingShopInventory',
        },
        NEW_ITEM_CLICK: {
          actions: buyItem,
          target: 'takingShopInventory',
        },
        NEXT_BATTLE_CLICK: {
          actions: prepareNextBattle,
          target: 'newRound',
        },
      },
    },
    takingShopInventory: {
      entry: disableUnaffordableItems,
      always: 'shopping',
    },
    betweenRounds: {
      entry: resetPlayerDeckStatuses,
      on: {
        NEXT_BATTLE_CLICK: {
          actions: prepareNextBattle,
          target: 'newRound',
        },
        DESTROY_CARDS_CLICK: {
          target: 'destroyingCards',
        },
        ITEM_SHOP_CLICK: {
          target: 'enteringShop',
        },
      },
    },
    destroyingCards: {
      entry: disableUnaffordableCards,
      on: {
        CARD_TO_DESTROY_CLICK: {
          actions: destroyCard,
          target: 'takingCardInventory',
        },
        CANCEL_CARD_DESTRUCTION_CLICK: {
          target: 'betweenRounds',
        },
      },
    },
    takingCardInventory: {
      entry: disableUnaffordableCards,
      always: 'destroyingCards',
    },
    // TODO: Some way to restart the game
    defeat: {},
  },
})
