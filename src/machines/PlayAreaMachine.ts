import { Machine, assign, ActionObject } from 'xstate'
import { shuffle, rng, getSound } from 'src/functions'
import { Player, Card, Deck, Monster } from 'src/interfaces'
import ImpactSfx from 'src/sounds/impact.slice.wav'
import CoinsSfx from 'src/sounds/items.coin.wav'
import config from 'src/config'

export const PLAY_AREA_MACHINE_ID = 'game-machine'
export const PLAY_AREA_MACHINE_DEFAULT_CONTEXT: PlayAreaContext = {
  player: config.player,
  playerDeck: (config.startingDeck as Array<Card>).map((card, index) => {
    return {
      ...card,
      id: `${card.id}-${index}`,
      overlayVariant: 'none',
    }
  }),
  classDeck: config.cards,
  itemShop: {
    cards: [],
  },
  drawPile: [],
  currentHand: [],
  cardInPlay: undefined,
  discardPile: [],
  monster: undefined,
  spoils: {
    gold: 0,
  },
}
const IMPACT_SFX_VOLUME = 0.33
const impactSound = getSound({ src: ImpactSfx, volume: IMPACT_SFX_VOLUME })
const coinsSound = getSound({ src: CoinsSfx })

export interface PlayAreaStateSchema {
  states: {
    newRound: {}
    surveying: {}
    reshuffling: {}
    drawing: {}
    choosing: {}
    playing: {}
    attacking: {}
    defending: {}
    victory: {}
    shopping: {}
    doneShopping: {}
    defeat: {}
  }
}

export type PlayAreaEvent =
  | { type: 'CHOOSE_CARD'; card: Card }
  | { type: 'ITEM_SHOP_CLICK' }
  | { type: 'LEAVE_SHOP_CLICK' }
  | { type: 'NEW_CARD_CLICK'; card: Card }
  | { type: 'NEXT_BATTLE_CLICK' }

export interface PlayAreaContext {
  player: Player
  playerDeck: Deck
  classDeck: Deck
  itemShop: {
    cards: Deck
  }
  drawPile: Deck
  currentHand: Deck
  cardInPlay: Card | undefined
  discardPile: Deck
  monster: Monster | undefined
  spoils: {
    gold: number
  }
}

/* ⚔️ Actions ⚔️ */
const awardSpoils: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const { player, monster, spoils } = ctx
  const { inventory } = player

  if (!monster) return {}

  const { goldBounty } = monster
  const nextGold = (inventory.gold += goldBounty)
  coinsSound.play()

  return {
    spoils: {
      ...spoils,
      gold: goldBounty,
    },
    player: {
      ...player,
      inventory: {
        gold: nextGold,
      },
    },
  }
})

const getNewMonster: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const newMonster = config.monsters[rng(config.monsters.length)]
  newMonster.sfx.intro.play()

  return {
    monster: {
      ...newMonster,
      isDefeated: false,
    },
  }
})

const monsterAttack: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const { monster, player } = ctx

  if (!monster) return {}

  const rawDamage = monster.stats.attack - player.stats.defense
  const damage = rawDamage > 0 ? rawDamage : 0
  impactSound.play()

  return {
    player: {
      ...player,
      damageTaken: damage,
      stats: {
        ...player.stats,
        health: player.stats.health - damage,
      },
    },
  }
})

const playerAttack: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const { monster, cardInPlay } = ctx

  if (!cardInPlay || !monster) return {}

  const damage = cardInPlay.stats.attack
  monster.sfx.damage.play()
  impactSound.play()

  return {
    monster: {
      ...monster,
      damageTaken: damage,
      stats: {
        ...monster.stats,
        health: monster.stats.health - damage,
      },
    },
    cardInPlay: undefined,
    discardPile: [...ctx.discardPile, { ...cardInPlay, isRevealed: false }],
  }
})

const createDrawPile: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const newDrawPile = shuffle(ctx.playerDeck)

  return {
    drawPile: newDrawPile, // Required to not mutate initial state...probably a better way to handle this
  }
})

const reshuffle: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const discardPile = ctx.discardPile

  return {
    drawPile: shuffle([...discardPile]), // Required to not mutate initial state...probably a better way to handle this
    discardPile: [],
  }
})

const prepareNextBattle: ActionObject<PlayAreaContext, { type: 'NEXT_BATTLE_CLICK' }> = assign(
  ctx => {
    return {
      drawPile: [],
      discardPile: [],
      currentHand: [],
    }
  },
)

const drawHand: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const drawnCards = ctx.drawPile.filter((_card, index) => index < 3) // First 3 cards
  const remainingCards = ctx.drawPile.filter((_card, index) => index >= 3)
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
})

const playCard: ActionObject<PlayAreaContext, { type: 'CHOOSE_CARD'; card: Card }> = assign(
  (ctx, event) => {
    const chosenCard = event.card

    const remainingCards = [...ctx.currentHand.filter(card => card.id !== chosenCard.id)]
    chosenCard.sfx.play()

    return {
      currentHand: remainingCards,
      cardInPlay: chosenCard,
    }
  },
)

const killMonster: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  if (!ctx.monster) return {}

  ctx.monster.sfx.death.play()

  return {
    monster: undefined,
  }
})

const stockShop: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const { player } = ctx
  const rngMax = ctx.classDeck.length - 1
  const cardsOnOffer = [
    ctx.classDeck[rng(rngMax)],
    ctx.classDeck[rng(rngMax)],
    ctx.classDeck[rng(rngMax)],
  ].map((card, index) => ({
    ...card,
    id: `${card.id}-from-shop-${index}`,
    isDisabled: player.inventory.gold < card.price,
  }))

  return {
    itemShop: {
      cards: cardsOnOffer,
    },
  }
})

const buyCard: ActionObject<PlayAreaContext, { type: 'NEW_CARD_CLICK'; card: Card }> = assign(
  (ctx, event) => {
    const { player, playerDeck, itemShop } = ctx
    const { inventory } = player
    const { gold } = inventory
    const chosenCard = event.card

    return {
      playerDeck: [...playerDeck, chosenCard],
      player: {
        ...player,
        inventory: {
          gold: gold - chosenCard.price,
        },
      },
      itemShop: {
        ...itemShop,
        cards: (itemShop.cards as any[]).map((card: Card) => {
          if (card.id === chosenCard.id) {
            return {
              ...chosenCard,
              isPurchased: true,
            }
          }

          return {
            ...card,
            isDisabled: player.inventory.gold - chosenCard.price < card.price,
          }
        }),
      },
    }
  },
)

/* 🛡️ Guards 🛡️ */
const playerIsAlive = (ctx: PlayAreaContext) => ctx.player.stats.health > 0
const playerIsDead = (ctx: PlayAreaContext) => ctx.player.stats.health <= 0
const monsterIsAlive = (ctx: PlayAreaContext) =>
  ctx.monster ? ctx.monster.stats.health > 0 : false
const monsterIsDead = (ctx: PlayAreaContext) =>
  ctx.monster ? ctx.monster.stats.health <= 0 : false
const playerCanDraw = (ctx: PlayAreaContext) => ctx.drawPile.length > 0
const drawingIsNotNeeded = (ctx: PlayAreaContext) =>
  ctx.drawPile.length === 0 && ctx.currentHand.length > 0
const playerCannotDraw = (ctx: PlayAreaContext) =>
  ctx.drawPile.length === 0 && ctx.currentHand.length === 0

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
