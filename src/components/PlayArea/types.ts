import DeckInterface from '../../interfaces/Deck'
import CardInterface from '../../interfaces/Card'

export interface MachineContext {
  deck: DeckInterface
  drawPile: DeckInterface
  currentHand: DeckInterface
  cardInPlay: CardInterface
  discardPile: DeckInterface
}
