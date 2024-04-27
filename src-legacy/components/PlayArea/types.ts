import { Deck as DeckInterface, Card as CardInterface } from 'src/interfaces'

export interface MachineContext {
  deck: DeckInterface
  drawPile: DeckInterface
  currentHand: DeckInterface
  cardInPlay: CardInterface
  discardPile: DeckInterface
}
