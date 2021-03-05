import { Player, Card, Deck, Item, Monster } from 'src/interfaces'

export interface PlayAreaStateSchema {
  states: {
    newRound: {}
    surveying: {}
    reshuffling: {}
    drawing: {}
    choosing: {}
    playing: {}
    healing: {}
    attacking: {}
    defending: {}
    victory: {}
    shopping: {}
    disablingUnaffordableItems: {}
    doneShopping: {}
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

export interface PlayAreaContext {
  player: Player
  playerDeck: Deck
  classDeck: Deck
  itemShop: {
    cards: Deck
    items: Array<Item> | []
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
