import { Machine, assign } from 'xstate'
import shuffle from '../../functions/shuffle'
import rng from '../../functions/rng'
import config from '../../config'

const machineConfig = {
  id: 'play-area-machine',
  initial: 'idle',
  context: {
    player: {
      ...config.player,
      isDefeated: false,
    },
    playerDeck: config.cards,
    drawPile: [],
    currentHand: [],
    cardInPlay: undefined,
    discardPile: [],
    monster: undefined,
    feedback: undefined,
  },
  states: {
    idle: {
      entry: ['@createDrawPile', '@getMonster'],
      after: {
        300: 'drawing',
      },
    },
    drawing: {
      entry: '@drawHand',
      after: {
        300: 'choosing',
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
        300: 'attacking',
      },
    },
    attacking: {
      entry: '@playerAttack',
      after: [
        { delay: 300, target: 'drawing', cond: '#monsterIsAlive' },
        { delay: 300, target: 'victory', cond: '#monsterIsDead' },
      ],
    },
    defending: {
      entry: '@monsterAttack',
      after: [
        { delay: 300, target: 'drawing', cond: '#playerIsAlive' },
        { delay: 300, target: 'defeat', cond: '#playerIsDead' },
      ],
    },
    victory: {
      on: {
        NEXT_BATTLE_CLICK: {
          actions: ['@getMonster', '@discardHand', '@discardDrawPile'],
          target: 'idle',
        },
      },
    },
    defeat: {},
  },
}

const PlayAreaMachine = Machine(machineConfig, {
  actions: {
    '@getMonster': assign(ctx => {
      return {
        monster: {
          ...config.monsters[rng(config.monsters.length)],
          isDefeated: false,
        },
      }
    }),
    '@monsterAttack': assign(ctx => {
      const { monster, player } = ctx

      return {
        player: {
          ...player,
          stats: {
            ...player.stats,
            hitPoints: player.stats.hitPoints - (monster.stats.attack - player.stats.defense),
          },
        },
      }
    }),
    '@playerAttack': assign(ctx => {
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
        discardPile: [...ctx.discardPile, { ...cardInPlay, isRevealed: false }],
        feedback: `${cardInPlay.stats.attack} damage dealt to ${monster.name}`,
      }
    }),
    '@createDrawPile': assign(ctx => {
      return {
        drawPile: shuffle([...ctx.playerDeck]), // Required to not mutate initial state...probably a better way to handle this
      }
    }),
    '@discardDrawPile': assign(ctx => {
      return {
        drawPile: [],
      }
    }),
    '@discardHand': assign(ctx => {
      return {
        currentHand: [],
      }
    }),
    '@drawHand': assign(ctx => {
      const drawnCards = ctx.drawPile.filter((card, index) => index < 3) // First 3 cards
      const remainingCards = ctx.drawPile.filter((card, index) => index >= 3)
      const currentHand = [...ctx.currentHand, ...drawnCards].map(card => {
        return {
          ...card,
          isRevealed: true,
        }
      })

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
  guards: {
    '#playerIsAlive': ctx => ctx.player.stats.hitPoints > 0,
    '#playerIsDead': ctx => ctx.player.stats.hitPoints <= 0,
    '#monsterIsAlive': ctx => ctx.monster.stats.hitPoints > 0,
    '#monsterIsDead': ctx => ctx.monster.stats.hitPoints <= 0,
  },
})

export default PlayAreaMachine
