import type { BattleState } from './battle-state.ts'
import type { Card } from '../../types/cards.ts'
import type { Item } from '../../types/items.ts'
import type { Cue } from './cues.ts'

/** Returns attack damage after defense, with a minimum of zero. */
export function calculateDamage(attack: number, defense: number): number {
  return Math.max(0, attack - defense)
}

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
          health:
            state.monster.stats.health -
            calculateDamage(card.stats.attack, state.monster.stats.defense),
        },
      },
    },
    cues: [{ type: 'card-hit' }],
  }
}

export function resolveMonsterAttack(state: BattleState): { state: BattleState; cues: Cue[] } {
  if (!state.monster) return { state, cues: [] }

  const damage = calculateDamage(state.monster.stats.attack, state.player.stats.defense)

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
