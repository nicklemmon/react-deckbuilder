import { describe, it, expect, vi, afterEach } from 'vitest'
import { createActor, createMachine, fromPromise, getNextSnapshot, waitFor } from 'xstate'

// Must be hoisted above imports that transitively load Howler
vi.mock('howler', () => ({
  Howl: class {
    play() {}
    stop() {}
    playing() {
      return false
    }
    volume() {
      return 0
    }
    fade() {}
    on() {
      return this
    }
    off() {
      return this
    }
  },
}))

// Intercepts getSound() across all modules (cards, monsters, items, app-machine itself)
vi.mock('../../../helpers/get-sound', () => ({
  getSound: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    playing: vi.fn(() => false),
    volume: vi.fn(),
    fade: vi.fn(),
    on: vi.fn(),
  }),
}))

import { appMachine } from '../app-machine'
import type { AppMachineContext } from '../app-machine'
import { STARTING_DECK } from '../../../helpers/cards'

// Accepts—but ignores—all soundtrack events so sendTo doesn't throw
const stubSoundtrackMachine = createMachine({
  id: 'stub-soundtrack',
  initial: 'idle',
  types: { events: {} as { type: string } },
  states: { idle: {} },
})

// A version of the machine safe to run in Node: no real asset loading, no real audio
const testMachine = appMachine.provide({
  actors: {
    loadAllAssets: fromPromise(async () => {}),
    soundtrackMachine: stubSoundtrackMachine,
  },
  actions: {
    playIntroMusic: () => {},
    playBattleMusic: () => {},
    playStoreMusic: () => {},
    stopMusic: () => {},
    playCues: () => {},
  },
})

// Builds a full AppMachineContext for resolveState(), with optional game overrides
function makeTestContext(
  gameOverrides: Partial<AppMachineContext['game']> = {},
): AppMachineContext {
  return {
    soundtrackRef: null,
    assets: { characterClasses: [], cards: [], playerPortraits: [] },
    game: {
      mode: 'standard',
      availablePlayerPortraits: [],
      player: {
        characterClass: undefined,
        characterClassDeck: [],
        characterName: undefined,
        characterPortrait: undefined,
        deck: [],
        gold: 125,
        status: 'idle' as const,
        stats: { maxHealth: 100, health: 100, defense: 0 },
        inventory: [],
      },
      monsters: [],
      items: [],
      shop: { cards: [], items: [] },
      cardDestructionPrice: 100,
      battle: {
        monster: undefined,
        hand: [],
        drawPile: [],
        discardPile: [],
        cardInPlay: undefined,
        itemInPlay: undefined,
      },
      pendingCues: [],
      ...gameOverrides,
    },
  }
}

// Safety net: stop any actors that leaked due to a test throw before manual cleanup
let liveActors: Array<{ stop(): void }> = []
afterEach(() => {
  liveActors.forEach((a) => a.stop())
  liveActors = []
})
function track<T extends { stop(): void }>(actor: T): T {
  liveActors.push(actor)
  return actor
}

describe('appMachine', () => {
  describe('loading', () => {
    it('starts in LoadingAssets', () => {
      const actor = track(createActor(testMachine))
      actor.start()
      expect(actor.getSnapshot().value).toBe('LoadingAssets')
      actor.stop()
    })

    it('transitions to TitleScreen once assets are loaded', async () => {
      const actor = track(createActor(testMachine))
      actor.start()
      await waitFor(actor, (snap) => snap.value === 'TitleScreen')
      expect(actor.getSnapshot().value).toBe('TitleScreen')
      actor.stop()
    })
  })

  describe('mode selection', () => {
    async function actorAtModeSelection() {
      const actor = track(createActor(testMachine))
      actor.start()
      await waitFor(actor, (snap) => snap.value === 'TitleScreen')
      actor.send({ type: 'TITLE_SCREEN_START_CLICK' })
      return actor
    }

    it('TITLE_SCREEN_START_CLICK transitions to ModeSelection', async () => {
      const actor = await actorAtModeSelection()
      expect(actor.getSnapshot().value).toBe('ModeSelection')
      actor.stop()
    })

    it('STANDARD_MODE_SELECTION transitions to CharacterCreation with mode=standard', async () => {
      const actor = await actorAtModeSelection()
      actor.send({ type: 'STANDARD_MODE_SELECTION' })
      const snap = actor.getSnapshot()
      expect(snap.value).toBe('CharacterCreation')
      expect(snap.context.game.mode).toBe('standard')
      actor.stop()
    })

    it('RAINBOW_MODE_SELECTION transitions to CharacterCreation with mode=rainbow', async () => {
      const actor = await actorAtModeSelection()
      actor.send({ type: 'RAINBOW_MODE_SELECTION' })
      const snap = actor.getSnapshot()
      expect(snap.value).toBe('CharacterCreation')
      expect(snap.context.game.mode).toBe('rainbow')
      actor.stop()
    })
  })

  describe('RESTART_CLICK from Defeat', () => {
    // getNextSnapshot gives a pure transition result without running non-assign side effects.
    // testMachine.resolveState injects synthetic context directly into the Defeat state.

    function defeatSnap(gameOverrides: Partial<AppMachineContext['game']> = {}) {
      return testMachine.resolveState({
        value: 'Defeat',
        context: makeTestContext(gameOverrides),
      })
    }

    it('transitions to CharacterCreation', () => {
      const next = getNextSnapshot(testMachine, defeatSnap(), { type: 'RESTART_CLICK' })
      expect(next.value).toBe('CharacterCreation')
    })

    it('calls playIntroMusic', () => {
      const playIntroSpy = vi.fn()
      const spyMachine = testMachine.provide({ actions: { playIntroMusic: playIntroSpy } })
      const actor = track(createActor(spyMachine, { snapshot: defeatSnap() }))
      actor.start()
      actor.send({ type: 'RESTART_CLICK' })
      expect(playIntroSpy).toHaveBeenCalledOnce()
      actor.stop()
    })

    it('resets player gold to 125', () => {
      const next = getNextSnapshot(
        testMachine,
        defeatSnap({
          player: {
            characterClass: undefined,
            characterClassDeck: [],
            characterName: 'Hero',
            characterPortrait: undefined,
            deck: [],
            gold: 999,
            status: 'idle' as const,
            stats: { maxHealth: 100, health: 0, defense: 0 },
            inventory: [],
          },
        }),
        { type: 'RESTART_CLICK' },
      )
      expect(next.context.game.player.gold).toBe(125)
    })

    it('resets player health to maxHealth and clears defense', () => {
      const next = getNextSnapshot(
        testMachine,
        defeatSnap({
          player: {
            characterClass: undefined,
            characterClassDeck: [],
            characterName: 'Hero',
            characterPortrait: undefined,
            deck: [],
            gold: 125,
            status: 'idle' as const,
            stats: { maxHealth: 100, health: 0, defense: 5 },
            inventory: [],
          },
        }),
        { type: 'RESTART_CLICK' },
      )
      expect(next.context.game.player.stats.health).toBe(100)
      expect(next.context.game.player.stats.defense).toBe(0)
    })

    it('resets battle state to empty', () => {
      const next = getNextSnapshot(testMachine, defeatSnap(), { type: 'RESTART_CLICK' })
      const { battle } = next.context.game
      expect(battle.hand).toEqual([])
      expect(battle.drawPile).toEqual([])
      expect(battle.discardPile).toEqual([])
      expect(battle.monster).toBeUndefined()
      expect(battle.cardInPlay).toBeUndefined()
    })

    it('resets shop to empty', () => {
      const next = getNextSnapshot(testMachine, defeatSnap(), { type: 'RESTART_CLICK' })
      expect(next.context.game.shop).toEqual({ cards: [], items: [] })
    })

    it('clears pendingCues', () => {
      const next = getNextSnapshot(testMachine, defeatSnap(), { type: 'RESTART_CLICK' })
      expect(next.context.game.pendingCues).toEqual([])
    })

    it('does not carry lastDefeatedMonster into the new run', () => {
      const next = getNextSnapshot(testMachine, defeatSnap(), { type: 'RESTART_CLICK' })
      expect(next.context.game.lastDefeatedMonster).toBeUndefined()
    })

    it('resets character name and portrait', () => {
      const next = getNextSnapshot(
        testMachine,
        defeatSnap({
          player: {
            characterClass: undefined,
            characterClassDeck: [],
            characterName: 'Hero',
            characterPortrait: 'portrait.png',
            deck: [],
            gold: 125,
            status: 'idle' as const,
            stats: { maxHealth: 100, health: 0, defense: 0 },
            inventory: [],
          },
        }),
        { type: 'RESTART_CLICK' },
      )
      expect(next.context.game.player.characterName).toBeUndefined()
      expect(next.context.game.player.characterPortrait).toBeUndefined()
    })

    it('preserves game mode from defeated run', () => {
      const next = getNextSnapshot(testMachine, defeatSnap({ mode: 'rainbow' }), {
        type: 'RESTART_CLICK',
      })
      expect(next.context.game.mode).toBe('rainbow')
    })

    it('preserves availablePlayerPortraits from defeated run', () => {
      const portraits = [{ path: '/portraits/hero.standard.webp', url: '/hero.webp' }]
      const next = getNextSnapshot(
        testMachine,
        defeatSnap({ availablePlayerPortraits: portraits }),
        {
          type: 'RESTART_CLICK',
        },
      )
      expect(next.context.game.availablePlayerPortraits).toEqual(portraits)
    })

    it('resets inventory to empty', () => {
      const next = getNextSnapshot(testMachine, defeatSnap(), { type: 'RESTART_CLICK' })
      expect(next.context.game.player.inventory).toEqual([])
    })

    it('populates a fresh starting deck matching STARTING_DECK length', () => {
      const next = getNextSnapshot(testMachine, defeatSnap(), { type: 'RESTART_CLICK' })
      expect(next.context.game.player.deck.length).toBe(STARTING_DECK.length)
    })
  })
})
