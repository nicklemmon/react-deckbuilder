import type { Card } from '../../types/cards.ts'
import type { Item } from '../../types/items.ts'
import type { Monster } from '../../types/monsters.ts'
import type { AvatarStatus } from '../../components/avatar.tsx'
import type { Cue } from './cues.ts'

export type Battle = {
  monster?: Monster
  hand: Card[]
  drawPile: Card[]
  discardPile: Card[]
  cardInPlay?: Card
  itemInPlay?: Item
}

export type BattleState = {
  player: {
    stats: { maxHealth: number; health: number; defense: number }
    status: AvatarStatus
  }
  monster?: Monster
  hand: Card[]
  drawPile: Card[]
  discardPile: Card[]
  cardInPlay?: Card
  itemInPlay?: Item
}

type BattleGame = {
  player: {
    stats: { maxHealth: number; health: number; defense: number }
    status: AvatarStatus
  }
  battle: Battle
  pendingCues: Cue[]
}

export function toBattleState(game: BattleGame): BattleState {
  return {
    player: {
      stats: game.player.stats,
      status: game.player.status,
    },
    monster: game.battle.monster,
    hand: game.battle.hand,
    drawPile: game.battle.drawPile,
    discardPile: game.battle.discardPile,
    cardInPlay: game.battle.cardInPlay,
    itemInPlay: game.battle.itemInPlay,
  }
}

export function writeBattleState<G extends BattleGame>(game: G, next: BattleState, cues: Cue[]): G {
  return {
    ...game,
    player: {
      ...game.player,
      stats: next.player.stats,
      status: next.player.status,
    },
    battle: {
      ...game.battle,
      monster: next.monster,
      hand: next.hand,
      drawPile: next.drawPile,
      discardPile: next.discardPile,
      cardInPlay: next.cardInPlay,
      itemInPlay: next.itemInPlay,
    },
    pendingCues: [...game.pendingCues, ...cues],
  } as G
}
