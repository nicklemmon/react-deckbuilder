import { Player, Card, Deck, Item, Monster } from 'src/interfaces'

export interface PlayAreaStateSchema {
  states: {
    newRound: {}
    surveying: {}
    reshuffling: {}
    drawing: {}
    choosing: {}
    playing: {}
    usingItem: {}
    healing: {}
    attacking: {}
    defending: {}
    victory: {}
    betweenRounds: {}
    enteringShop: {}
    shopping: {}
    takingCardInventory: {}
    takingShopInventory: {}
    destroyingCards: {}
    destroyingCard: {}
    defeat: {}
  }
}

export type PlayAreaEvent =
  | { type: 'CHOOSE_CARD'; card: Card }
  | { type: 'CHOOSE_ITEM'; item: Item }
  | { type: 'ITEM_SHOP_CLICK' }
  | { type: 'LEAVE_SHOP_CLICK' }
  | { type: 'NEW_CARD_CLICK'; card: Card }
  | { type: 'NEW_ITEM_CLICK'; item: Item }
  | { type: 'NEXT_BATTLE_CLICK' }
  | { type: 'CARD_TO_DESTROY_CLICK'; card: Card }
  | { type: 'STOP_DESTROYING_CLICK' }
  | { type: 'DESTROY_CARDS_CLICK' }

export type ItemShop = {
  cards: Deck
  items: Array<Item> | []
}

export interface PlayAreaContext {
  player: Player
  playerDeck: Deck
  chosenItem: Item | undefined
  classDeck: Deck
  itemShop: ItemShop
  drawPile: Deck
  currentHand: Deck
  cardInPlay: Card | undefined
  cardToDestroy: Card | undefined
  discardPile: Deck
  monster: Monster | undefined
  spoils: {
    gold: number
  }
}
