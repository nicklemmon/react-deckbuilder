export type Cue =
  | { type: 'card-hit' }
  | { type: 'player-hit' }
  | { type: 'heal' }
  | { type: 'card-draw' }
  | { type: 'monster-intro' }
  | { type: 'coins' }
  | { type: 'monster-death' }
  | { type: 'card-use' }
  | { type: 'item-use' }
