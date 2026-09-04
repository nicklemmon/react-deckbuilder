# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

- `npm start` - Start development server using Vite
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run prettier:write` - Format all files with Prettier

## Code Quality

Run `npm run qa` before considering any task complete. If failures occur, address them.

## Architecture Overview

This is a React-based deck-building game built with TypeScript, XState for state management, and
Motion for animations. The game uses Vite as the build tool and Howler.js for audio.

### Core Architecture

- **State Management**: XState machines control game flow and music playback
  - `app-machine` - Main game states (character creation, battles, shopping, etc.)
  - `soundtrack-machine` - Music playback with cross-fading between tracks
- **Component Structure**: Modular React components in `src/components/` with CSS modules for
  styling
- **Asset Management**: Organized folder structure for cards, monsters, character classes, and items
  with automatic resolution via `import.meta.glob`

### Key Directories

- `src/cards/` - Card definitions with config.ts, artwork.webp, and sfx.wav files
- `src/monsters/` - Monster definitions with similar structure
- `src/character-classes/` - Character class definitions with deck configurations
- `src/items/` - Consumable items (potions) with effects and sounds
- `src/components/` - React components with corresponding CSS modules
- `src/machines/` - XState machines for game logic and music
- `src/types/` - TypeScript type definitions
- `src/helpers/` - Utility functions for cards, monsters, items, audio, etc.

### Asset Convention

Each game entity (card, monster, character class, item) follows a consistent folder structure:

```
entity-name/
├── config.ts (game data and stats)
├── artwork.webp (visual asset)
└── sfx.wav (sound effects)
```

### TypeScript conventions

- Use `type` over `interface`

### Adding New Game Content

- **Cards**: Create folder in `src/cards/` with config.ts using `defineCard()` helper
- **Monsters**: Create folder in `src/monsters/` with config.ts using `defineMonster()` helper
- **Character Classes**: Create folder in `src/character-classes/` with config.ts using
  `defineCharacterClass()` helper
- **Items**: Create folder in `src/items/` with config.ts using `defineItem()` helper

Assets are automatically discovered and loaded via Vite's glob imports in the helper files.

### State Machines

**App Machine** (`src/machines/app-machine/app-machine.ts`)

Handles game flow including:

- Asset loading → Character creation → Battle rounds
- Turn-based combat with card play, effects, and monster responses
- Shopping phases between battles
- Card destruction mechanics
- Inventory item usage
- Spawns and communicates with the soundtrack machine

**Soundtrack Machine** (`src/machines/soundtrack-machine/soundtrack-machine.ts`)

Manages music playback:

- Ensures only one track plays at a time
- Cross-fades between tracks (battle, store, boogie)
- Respects base volume settings defined in `tracks.ts`
- Controlled via events sent from the app machine

### Audio System

**Music**: Centralized in `src/machines/soundtrack-machine/tracks.ts` with Howl instances shared
across the app. The soundtrack machine coordinates playback and cross-fading.

**Sound Effects**: Uses Howler.js with the `getSound()` helper. Effects are automatically loaded for
each game entity and triggered by state machine actions.

**Fade Utilities**: `fadeIn()` and `fadeOut()` in `src/helpers/fade-sound.ts` provide smooth audio
transitions with configurable duration and target volume.

## Domain Vocabulary

Use these terms exactly in code, comments, and reviews.

**Run** — one playthrough: persists across battles. Holds run-level resources on `game.player`
(`gold`, `deck`, `inventory`, `characterClass`, and the player's combat `stats` — `maxHealth`,
`health`, `defense`). These survive every new battle.

**Battle** — one fight against one monster. Its ephemeral state lives in `game.battle` and is wiped
and rebuilt on each `NewRound`: `monster`, `hand`, `drawPile`, `discardPile`, `cardInPlay`,
`itemInPlay`. Player combat stats deliberately do **not** live here — they are run-level.

**BattleState** — the value the battle resolvers operate on. Assembled at the seam from
`game.player` (combat `stats` + `status`) and `game.battle` (the ephemeral fields) by
`toBattleState(game)`, and written back to both by `writeBattleState(game, next, cues)`. See
`src/machines/app-machine/battle-state.ts`.

**Resolver** — a pure function `(BattleState, …args) -> { state, cues }`. No I/O, no audio, no
randomness except through an injected `Rng`. The resolvers are the test surface for game rules; they
are exercised directly, without booting the XState actor. Live in
`src/machines/app-machine/battle.ts`.

**Cue** — a semantic descriptor of a sound a reducer wants played, returned as data rather than
played inline (e.g. `{ type: 'card-hit' }`). Reducers stay pure; the `playCues` action drains
`game.pendingCues`, maps each `Cue` to its `Howl` (reading entity `sfx` from context), and plays it.
Defined in `src/machines/app-machine/cues.ts`. Sounds fired from sibling action literals (button
click, door, win, lose, music) are not cues — they were never inside an `assign`.

**Rng** — the injectable seam over all gameplay nondeterminism:
`{ int(maxExclusive), shuffle(xs), id() }`. `int` returns `[0, maxExclusive)`. `id()` replaces
`crypto.randomUUID()`. Two adapters: `MathRandomRng` (prod singleton) and `SeededRng` (tests). Lives
in `src/helpers/rng.ts`. Presentation-only randomness (e.g. avatar UI jitter) is **not** gameplay
nondeterminism and must not go through this seam.
