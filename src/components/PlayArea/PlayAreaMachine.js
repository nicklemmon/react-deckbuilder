import { Machine, assign } from 'xstate'
import shuffle from '../../functions/shuffle'
import rng from '../../functions/rng'
import config from '../../config'

const machineConfig = {
  id: 'play-area-machine',
  initial: 'idle',
  context: {
    playerDeck: config.cards,
    drawPile: [],
    currentHand: [],
    cardInPlay: undefined,
    discardPile: [],
    monster: config.monsters[rng(config.monsters.length)],
  },
  states: {
    idle: {
      entry: '@createDrawPile',
      on: {
        DRAW: {
          actions: '@drawHand',
          target: 'choosing',
        },
      },
    },
    drawing: {},
    choosing: {
      on: {
        CHOOSE: {
          actions: '@playCard',
          target: 'playing',
        },
      },
    },
    playing: {},
  },
}

const PlayAreaMachine = Machine(machineConfig, {
  actions: {
    '@createDrawPile': assign(ctx => {
      return {
        drawPile: shuffle([...ctx.playerDeck]), // Required to not mutate initial state...probably a better way to handle this
      }
    }),
    '@drawHand': assign(ctx => {
      const drawnCards = [...ctx.drawPile.slice(3)]
      const remainingCards = [...ctx.drawPile.splice(0, ctx.drawPile.length - 3)]

      return {
        currentHand: drawnCards,
        drawPile: remainingCards,
      }
    }),
    '@playCard': assign((ctx, event) => {
      const chosenCard = event.data.card
      const remainingCards = [...ctx.currentHand.filter(card => card.id !== chosenCard.id)]

      return {
        currentHand: remainingCards,
        cardInPlay: chosenCard,
      }
    }),
  },
})

export default PlayAreaMachine
