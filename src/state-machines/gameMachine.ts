import { Machine } from 'xstate'

export default Machine({
  id: 'game-machine',
  initial: 'idle',
  context: {
    currentHand: [],
    drawPile: [],
    discardPile: [],
    cardInPlay: [],
  },
  states: {
    idle: {},
    shuffling: {}, // Deck initially shuffled
    drawing: {}, // Top X cards drawn from the top
    choosing: {}, // Player making a card selection
    playing: {}, // Player selection takes effect,
    end: {}, // Player wins or loses
  },
})
