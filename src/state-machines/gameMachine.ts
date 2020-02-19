import { Machine } from 'xstate'

export default Machine({
  id: 'game-machine',
  initial: 'idle',
  context: {},
  states: {
    idle: {},
    shuffling: {}, // Deck initially shuffled
    drawing: {}, // Top X cards drawn from the top
    choosing: {}, // Player making a card selection
    play: {}, // Player selection takes effect,
    victory: {}, // Player wins
    defeat: {}, // Player loses
  },
})
