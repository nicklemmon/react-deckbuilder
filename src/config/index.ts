import items from './items'
import cards from './cards'
import monsters from './monsters'
import player from './player'
import { PLAYER_PORTRAITS } from './playerPortraits'
import { getCard } from '../functions/cards'
import type { Deck } from '../interfaces'

const STARTING_DECK: Deck = [
  getCard('firebolt', cards),
  getCard('firebolt', cards),
  getCard('lightning', cards),
  getCard('earthquake', cards),
  getCard('strike', cards),
  getCard('strike', cards),
]

// eslint-disable-next-line
export default {
  startingDeck: STARTING_DECK,
  cards,
  items,
  monsters,
  player,
  playerPortraits: PLAYER_PORTRAITS,
}
