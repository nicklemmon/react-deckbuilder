import { Machine } from 'xstate'

export default Machine({
  id: 'player-machine',
  initial: 'idle',
  context: {
    hitPoints: [],
  },
  states: {
    idle: {},
    drawing: {},
    choosing: {},
    playing: {},
  },
})
