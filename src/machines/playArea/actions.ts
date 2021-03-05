import { assign, ActionObject } from 'xstate'
import config from 'src/config'
import { shuffle, rng, getSound } from 'src/functions'
import { Card, Item, ItemStatus } from 'src/interfaces'
import ImpactSfx from 'src/sounds/impact.slice.wav'
import CoinsSfx from 'src/sounds/items.coin.wav'
import { IMPACT_SFX_VOLUME } from './constants'
import { PlayAreaEvent, PlayAreaContext } from './types'

const impactSound = getSound({ src: ImpactSfx, volume: IMPACT_SFX_VOLUME })
const coinsSound = getSound({ src: CoinsSfx })

export const awardSpoils: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
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
        ...player.inventory,
        gold: nextGold,
      },
    },
  }
})

export const getNewMonster: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const newMonster = config.monsters[rng(config.monsters.length)]
  newMonster.sfx.intro.play()

  return {
    monster: {
      ...newMonster,
      isDefeated: false,
    },
  }
})

export const monsterAttack: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
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

export const playerAttack: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
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

export const createDrawPile: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const newDrawPile = shuffle(ctx.playerDeck)

  return {
    drawPile: newDrawPile, // Required to not mutate initial state...probably a better way to handle this
  }
})

export const reshuffle: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const discardPile = ctx.discardPile

  return {
    drawPile: shuffle([...discardPile]), // Required to not mutate initial state...probably a better way to handle this
    discardPile: [],
  }
})

export const prepareNextBattle: ActionObject<
  PlayAreaContext,
  { type: 'NEXT_BATTLE_CLICK' }
> = assign(ctx => {
  return {
    drawPile: [],
    discardPile: [],
    currentHand: [],
  }
})

export const drawHand: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
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

export const playCard: ActionObject<PlayAreaContext, { type: 'CHOOSE_CARD'; card: Card }> = assign(
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

export const killMonster: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  if (!ctx.monster) return {}

  ctx.monster.sfx.death.play()

  return {
    monster: undefined,
  }
})

export const stockShop: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const { player } = ctx
  const cardsRngMax = ctx.classDeck.length - 1
  const cardsOnOffer = [
    ctx.classDeck[rng(cardsRngMax)],
    ctx.classDeck[rng(cardsRngMax)],
    ctx.classDeck[rng(cardsRngMax)],
  ].map((card, index) => ({
    ...card,
    id: `${card.id}-from-shop-${index}`,
    isDisabled: player.inventory.gold < card.price,
  }))
  const itemsOnOffer = config.items.map((item, index) => ({
    ...item,
    id: `${item.id}-from-shop-${index}`,
    status: player.inventory.gold < item.price ? ItemStatus['disabled'] : ItemStatus['idle'],
  }))

  return {
    itemShop: {
      cards: cardsOnOffer,
      items: itemsOnOffer,
    },
  }
})

export const buyCard: ActionObject<
  PlayAreaContext,
  { type: 'NEW_CARD_CLICK'; card: Card }
> = assign((ctx, event) => {
  const { player, playerDeck, itemShop } = ctx
  const { inventory } = player
  const { gold } = inventory
  const chosenCard = event.card

  return {
    playerDeck: [...playerDeck, chosenCard],
    player: {
      ...player,
      inventory: {
        ...player.inventory,
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

        return card
      }),
    },
  }
})

export const buyItem: ActionObject<
  PlayAreaContext,
  { type: 'NEW_ITEM_CLICK'; item: Item }
> = assign((ctx, event) => {
  const { player, itemShop } = ctx
  const currentGold = player.inventory.gold
  const currentItems = player.inventory.items
  const chosenItem = event.item
  chosenItem.sfx.obtain.play()

  return {
    player: {
      ...player,
      inventory: {
        ...player.inventory,
        gold: currentGold - chosenItem.price,
        items: [...currentItems, chosenItem],
      },
    },
    itemShop: {
      ...itemShop,
      items: (itemShop.items as any[]).map((item: Item) => {
        if (item.id === chosenItem.id) {
          return {
            ...item,
            status: ItemStatus['purchased'],
          }
        }

        return item
      }),
    },
  }
})

export const disableUnaffordableItems: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(
  (ctx: PlayAreaContext) => {
    const { itemShop, player } = ctx

    return {
      itemShop: {
        ...itemShop,
        items: (itemShop.items as any[]).map((item: Item) => {
          return {
            ...item,
            status:
              item.price > player.inventory.gold ? ItemStatus['disabled'] : ItemStatus['idle'],
          }
        }),
        cards: (itemShop.cards as any[]).map((card: Card) => {
          return {
            ...card,
            isDisabled: card.price > player.inventory.gold,
          }
        }),
      },
    }
  },
)

export const useItem: ActionObject<PlayAreaContext, { type: 'CHOOSE_ITEM'; item: Item }> = assign(
  (ctx, event) => {
    const { player } = ctx
    const chosenItem = event.item
    chosenItem.sfx.use.play()

    return {
      chosenItem,
      player: {
        ...player,
        inventory: {
          ...player.inventory,
          // Remove the item from the player's inventory
          items: [...player.inventory.items].filter((item: Item) => item.id !== chosenItem.id),
        },
      },
    }
  },
)

export const healPlayer: ActionObject<PlayAreaContext, PlayAreaEvent> = assign(ctx => {
  const { player, chosenItem } = ctx

  if (!chosenItem) return {}

  const healingAmount = chosenItem.stats.health
  const nextPlayerHealth = getPlayerHealth(
    player.stats.health,
    healingAmount ? healingAmount : 0,
    player.stats.maxHealth,
  )
  chosenItem.sfx.effect.play()

  return {
    chosenItem: undefined,
    player: {
      ...player,
      healingAmount,
      status: {
        ...player.stats,
        health: nextPlayerHealth,
      },
    },
  }
})

function getPlayerHealth(currentHealth: number, healingAmount: number, maxHealth: number): number {
  if (currentHealth + healingAmount > maxHealth) {
    return maxHealth
  }

  return currentHealth + healingAmount
}
