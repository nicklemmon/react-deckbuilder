import { Deck } from 'src/interfaces'

export function shuffle(cards: Deck) {
  console.log('cards', cards)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}
