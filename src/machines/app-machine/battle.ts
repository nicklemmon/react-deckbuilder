import type { BattleState } from './battle-state.ts'
import type { Card } from '../../types/cards.ts'
import type { Item } from '../../types/items.ts'
import type { Cue } from './cues.ts'

export function resolveCardPlay(
  state: BattleState,
  card: Card,
): { state: BattleState; cues: Cue[] } {
  if (!state.monster) return { state, cues: [] }

  return {
    state: {
      ...state,
      monster: {
        ...state.monster,
        status: 'taking-damage',
        stats: {
          ...state.monster.stats,
          health: state.monster.stats.health - card.stats.attack,
        },
      },
    },
    cues: [{ type: 'card-hit' }],
  }
}

export function resolveMonsterAttack(state: BattleState): { state: BattleState; cues: Cue[] } {
  if (!state.monster) return { state, cues: [] }

  const rawDamage = state.monster.stats.attack - state.player.stats.defense
  const damage = rawDamage > 0 ? rawDamage : 0

  return {
    state: {
      ...state,
      player: {
        ...state.player,
        status: 'taking-damage',
        stats: {
          ...state.player.stats,
          health: state.player.stats.health - damage,
        },
      },
    },
    cues: [{ type: 'player-hit' }],
  }
}

export function resolveItemUse(
  state: BattleState,
  item: Item,
): { state: BattleState; cues: Cue[] } {
  const nextHealth = Math.min(state.player.stats.maxHealth, state.player.stats.health + item.value)

  return {
    state: {
      ...state,
      player: {
        ...state.player,
        status: 'healing',
        stats: {
          ...state.player.stats,
          health: nextHealth,
        },
      },
    },
    cues: [{ type: 'heal' }],
  }
}
