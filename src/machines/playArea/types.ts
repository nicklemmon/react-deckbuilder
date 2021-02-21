import { Player, Card, Deck, Monster } from 'src/interfaces'

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
