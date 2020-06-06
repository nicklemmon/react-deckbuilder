import { Machine, assign } from 'xstate'
import shuffle from '../../functions/shuffle'
import rng from '../../functions/rng'
import config from '../../config'

const machineConfig = {
  id: 'play-area-machine',
  initial: 'idle',
  context: {
    player: config.player,
    playerDeck: config.cards,
    drawPile: [],
    currentHand: [],
    cardInPlay: undefined,
    discardPile: [],
    monster: undefined,
  },
  states: {
    idle: {
      entry: ['@createDrawPile', '@getMonster'],
      after: {
        300: 'assessing',
      },
    },
    assessing: {
      after: [
        { delay: 300, target: 'reshuffling', cond: '#playerCannotDraw' },
        { delay: 300, target: 'drawing', cond: '#playerCanDraw' },
        { delay: 300, target: 'choosing', cond: '#drawingIsNotNeeded' },
      ],
    },
    reshuffling: {
      entry: '@reshuffle',
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
        800: 'attacking',
      },
    },
    attacking: {
      entry: '@playerAttack',
      after: [
        { delay: 800, target: 'defending', cond: '#monsterIsAlive' },
        { delay: 800, target: 'victory', cond: '#monsterIsDead' },
      ],
    },
    defending: {
      entry: '@monsterAttack',
      after: [
        { delay: 800, target: 'assessing', cond: '#playerIsAlive' },
        { delay: 800, target: 'defeat', cond: '#playerIsDead' },
      ],
    },
    victory: {
      entry: '@killMonster',
      on: {
        NEXT_BATTLE_CLICK: {
          actions: ['@getMonster', '@discardHand', '@discardDrawPile', '@discardDiscardPile'],
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
      const rawDamage = monster.stats.attack - player.stats.defense
      const damage = rawDamage > 0 ? rawDamage : 0

      return {
        player: {
          ...player,
          damageTaken: damage,
          stats: {
            ...player.stats,
            hitPoints: player.stats.hitPoints - damage,
          },
        },
      }
    }),
    '@playerAttack': assign(ctx => {
      const { monster, cardInPlay } = ctx
      const damage = cardInPlay.stats.attack

      return {
        monster: {
          ...monster,
          damageTaken: damage,
          stats: {
            ...monster.stats,
            hitPoints: monster.stats.hitPoints - damage,
          },
        },
        cardInPlay: null,
        discardPile: [...ctx.discardPile, { ...cardInPlay, isRevealed: false }],
      }
    }),
    '@createDrawPile': assign(ctx => {
      return {
        drawPile: shuffle([...ctx.playerDeck]), // Required to not mutate initial state...probably a better way to handle this
      }
    }),
    '@reshuffle': assign(ctx => {
      const discardPile = ctx.discardPile

      return {
        drawPile: shuffle([...discardPile]), // Required to not mutate initial state...probably a better way to handle this
        discardPile: [],
      }
    }),
    '@discardDrawPile': assign(ctx => {
      return {
        drawPile: [],
      }
    }),
    '@discardDiscardPile': assign(ctx => {
      return {
        discardPile: [],
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
    '@killMonster': assign(ctx => {
      return {
        monster: undefined,
      }
    }),
  },
  guards: {
    '#playerIsAlive': ctx => ctx.player.stats.hitPoints > 0,
    '#playerIsDead': ctx => ctx.player.stats.hitPoints <= 0,
    '#monsterIsAlive': ctx => ctx.monster.stats.hitPoints > 0,
    '#monsterIsDead': ctx => ctx.monster.stats.hitPoints <= 0,
    '#drawPileIsEmpty': ctx => ctx.drawPile.length === 0,
    '#drawPileIsNotEmpty': ctx => ctx.drawPile.length > 0,
    '#currentHandIsEmpty': ctx => ctx.currentHand.length === 0,
    '#currentHandIsNotEmpty': ctx => ctx.currentHand.length > 0,
    '#playerCanDraw': ctx => ctx.drawPile.length > 0,
    '#drawingIsNotNeeded': ctx => ctx.drawPile.length === 0 && ctx.currentHand.length > 0,
    '#playerCannotDraw': ctx => ctx.drawPile.length === 0 && ctx.currentHand.length === 0,
  },
})

export default PlayAreaMachine
