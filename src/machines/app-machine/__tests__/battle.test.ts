import { describe, it, expect } from 'vitest'
import { resolveCardPlay, resolveMonsterAttack, resolveItemUse } from '../battle'
import type { BattleState } from '../battle-state'
import type { Card } from '../../../types/cards'
import type { Monster } from '../../../types/monsters'
import type { Item } from '../../../types/items'

const mockHowl = { play: () => {} } as any

const baseMonster: Monster = {
  id: 'test-monster',
  status: 'idle',
  name: 'Test Monster',
  level: 1,
  goldBounty: 10,
  gameMode: 'standard',
  stats: { maxHealth: 100, health: 100, attack: 20, defense: 0 },
}

const baseCard: Card = {
  id: 'test-card',
  name: 'Test Card',
  sfx: mockHowl,
  rarity: 0,
  description: 'A test card',
  price: 10,
  stats: { attack: 15 },
}

const baseItem: Item = {
  id: 'test-item',
  name: 'Test Item',
  type: 'healing',
  value: 30,
  cost: 30,
  artwork: '',
  sfx: { obtain: mockHowl, use: mockHowl, effect: mockHowl },
}

const baseState: BattleState = {
  player: { stats: { maxHealth: 100, health: 100, defense: 0 }, status: 'idle' },
  monster: baseMonster,
  hand: [],
  drawPile: [],
  discardPile: [],
}

describe('resolveCardPlay', () => {
  it('reduces monster health by card attack', () => {
    const { state } = resolveCardPlay(baseState, baseCard)
    expect(state.monster?.stats.health).toBe(85)
  })

  it('sets monster status to taking-damage', () => {
    const { state } = resolveCardPlay(baseState, baseCard)
    expect(state.monster?.status).toBe('taking-damage')
  })

  it('returns card-hit cue', () => {
    const { cues } = resolveCardPlay(baseState, baseCard)
    expect(cues).toEqual([{ type: 'card-hit' }])
  })

  it('returns unchanged state and no cues when no monster', () => {
    const state: BattleState = { ...baseState, monster: undefined }
    const result = resolveCardPlay(state, baseCard)
    expect(result.state).toBe(state)
    expect(result.cues).toEqual([])
  })
})

describe('resolveMonsterAttack', () => {
  it('reduces player health by monster attack', () => {
    const { state } = resolveMonsterAttack(baseState)
    expect(state.player.stats.health).toBe(80)
  })

  it('mitigates damage by player defense', () => {
    const state: BattleState = {
      ...baseState,
      player: { ...baseState.player, stats: { ...baseState.player.stats, defense: 5 } },
    }
    const { state: next } = resolveMonsterAttack(state)
    expect(next.player.stats.health).toBe(85)
  })

  it('floors damage at 0 when defense exceeds attack', () => {
    const state: BattleState = {
      ...baseState,
      player: { ...baseState.player, stats: { ...baseState.player.stats, defense: 100 } },
    }
    const { state: next } = resolveMonsterAttack(state)
    expect(next.player.stats.health).toBe(100)
  })

  it('sets player status to taking-damage', () => {
    const { state } = resolveMonsterAttack(baseState)
    expect(state.player.status).toBe('taking-damage')
  })

  it('returns player-hit cue', () => {
    const { cues } = resolveMonsterAttack(baseState)
    expect(cues).toEqual([{ type: 'player-hit' }])
  })

  it('returns unchanged state and no cues when no monster', () => {
    const state: BattleState = { ...baseState, monster: undefined }
    const result = resolveMonsterAttack(state)
    expect(result.state).toBe(state)
    expect(result.cues).toEqual([])
  })
})

describe('resolveItemUse', () => {
  it('heals player by item value', () => {
    const state: BattleState = {
      ...baseState,
      player: { ...baseState.player, stats: { ...baseState.player.stats, health: 50 } },
    }
    const { state: next } = resolveItemUse(state, baseItem)
    expect(next.player.stats.health).toBe(80)
  })

  it('caps health at maxHealth', () => {
    const state: BattleState = {
      ...baseState,
      player: { ...baseState.player, stats: { ...baseState.player.stats, health: 90 } },
    }
    const { state: next } = resolveItemUse(state, baseItem)
    expect(next.player.stats.health).toBe(100)
  })

  it('sets player status to healing', () => {
    const { state } = resolveItemUse(baseState, baseItem)
    expect(state.player.status).toBe('healing')
  })

  it('returns heal cue', () => {
    const { cues } = resolveItemUse(baseState, baseItem)
    expect(cues).toEqual([{ type: 'heal' }])
  })
})
