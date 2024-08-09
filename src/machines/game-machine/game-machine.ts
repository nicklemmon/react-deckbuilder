import { assign, setup } from 'xstate'
import arrayShuffle from 'array-shuffle'
import { CharacterClass } from '../../types/character-classes'
import { rng } from '../../helpers/rng'
import { Card } from '../../types/cards'
import { Monster } from '../../types/monsters'
import { MONSTERS } from '../../helpers/monsters'
import { shuffle } from '../../helpers/shuffle'

/** Unique ID for the game machine */
export const GAME_MACHINE_ID = 'game'

type GameMachineContext = {
  player: {
    characterClass: CharacterClass
    characterName: string
    characterPortrait: string
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
  monster: Monster
  spoils: {
    gold: number
  }
}

export const gameMachine = setup({
  types: {
    context: {} as GameMachineContext,
    events: {},
  },
  actions: {
    createDrawPile: () =>
      assign({
        drawPile: (ctx: GameMachineContext) => {
          console.log('ctx', ctx)
          const newDrawPile = shuffle(ctx.player.deck).map((card) => {
            return {
              ...card,
              status: 'face-down',
            }
          })

          console.log('newDrawPile', newDrawPile)

          return newDrawPile
        },
      }),
    getNextMonster: assign({
      monster: () => {
        const shuffledMonsters = arrayShuffle(MONSTERS)
        const nextMonster = shuffledMonsters[rng(shuffledMonsters.length)]
        console.log('nextMonster', nextMonster)

        return {
          status: 'idle',
          ...nextMonster,
        }
      },
    }),
  },
}).createMachine({
  id: GAME_MACHINE_ID,
  initial: 'SetupNewRound',
  context: {
    player: {
      characterClass: undefined,
      characterName: undefined,
      characterPortrait: undefined,
      deck: [],
    },
    shop: {
      cards: [],
      items: [],
    },
    currentHand: [],
    discardPile: [],
    drawPile: [],
    chosenItem: undefined,
    cardInPlay: undefined,
    cardToDestroy: undefined,
    monster: {
      status: 'idle', // 'defeated' | 'idle'
    },
    spoils: {
      gold: 0,
    },
  },
  states: {
    SetupNewRound: {
      entry: ['getNextMonster', 'createDrawPile'],
      after: {
        300: 'DeterminingNextPhase',
      },
    },
    DeterminingNextPhase: {
      after: {},
    },
  },
})
