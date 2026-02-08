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
