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
    feedback: undefined,
  },
  states: {
    idle: {
      entry: '@createDrawPile',
      after: {
        1000: 'drawing',
      },
    },
    drawing: {
      entry: '@drawHand',
      after: {
        1000: 'choosing',
      },
    },
    choosing: {
      on: {
        CHOOSE: {
          actions: '@playCard',
          target: 'playing',
        },
      },
    },
    playing: {
      after: {
        1000: 'battling',
      },
    },
    battling: {
      entry: '@battle',
      after: {
        1000: 'defending',
      },
    },
    defending: {
      entry: '@monsterAttack',
      /*
        TODO:
        // Lots of conditions to check for:
        + In case the monster is defeated, go to "victory"
        + In case the player is defeated, go to "defeat"
        + Otherwise, return to "drawing"
      */
      after: {
        1000: 'drawing',
      },
    },
    victory: {},
    defeat: {},
  },
}

const PlayAreaMachine = Machine(machineConfig, {
  actions: {
    '@battle': assign(ctx => {
      const { monster, cardInPlay } = ctx

      return {
        monster: {
          ...monster,
          stats: {
            ...monster.stats,
            hitPoints: monster.stats.hitPoints - cardInPlay.stats.attack,
          },
        },
        cardInPlay: null,
        discardPile: [...ctx.discardPile, cardInPlay],
        feedback: `${cardInPlay.stats.attack} damage dealt to ${monster.name}`,
      }
    }),
    '@createDrawPile': assign(ctx => {
      return {
        drawPile: shuffle([...ctx.playerDeck]), // Required to not mutate initial state...probably a better way to handle this
      }
    }),
    '@drawHand': assign(ctx => {
      const drawnCards = ctx.drawPile.filter((card, index) => index < 3) // First 3 cards
      const remainingCards = ctx.drawPile.filter((card, index) => index >= 3)
      const currentHand = [...ctx.currentHand, ...drawnCards]

      return {
        currentHand,
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
