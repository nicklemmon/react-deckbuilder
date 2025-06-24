# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start development server using Vite
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run prettier:write` - Format all files with Prettier

## Code Quality

**IMPORTANT**: Always run `npm run prettier:write` on files you have changed to ensure consistent formatting.

## Architecture Overview

This is a React-based deck-building game built with TypeScript, XState for state management, and Motion for animations. The game uses Vite as the build tool and Howler.js for audio.

### Core Architecture

- **State Management**: XState machine (`src/machines/app-machine/app-machine.ts`) controls the entire game flow with states like `CharacterCreation`, `PlayerChoosing`, `ApplyingCardEffects`, `Shopping`, etc.
- **Component Structure**: Modular React components in `src/components/` with CSS modules for styling
- **Asset Management**: Organized folder structure for cards, monsters, character classes, and items with automatic resolution via `import.meta.glob`

### Key Directories

- `src/cards/` - Card definitions with config.ts, artwork.png, and sfx.wav files
- `src/monsters/` - Monster definitions with similar structure
- `src/character-classes/` - Character class definitions with deck configurations
- `src/items/` - Consumable items (potions) with effects and sounds
- `src/components/` - React components with corresponding CSS modules
- `src/types/` - TypeScript type definitions
- `src/helpers/` - Utility functions for cards, monsters, items, etc.

### Asset Convention

Each game entity (card, monster, character class, item) follows a consistent folder structure:
```
entity-name/
├── config.ts (game data and stats)
├── artwork.png (visual asset)
└── sfx.wav (sound effects)
```

### Adding New Game Content

- **Cards**: Create folder in `src/cards/` with config.ts using `defineCard()` helper
- **Monsters**: Create folder in `src/monsters/` with config.ts using `defineMonster()` helper  
- **Character Classes**: Create folder in `src/character-classes/` with config.ts using `defineCharacterClass()` helper
- **Items**: Create folder in `src/items/` with config.ts using `defineItem()` helper

Assets are automatically discovered and loaded via Vite's glob imports in the helper files.

### State Machine Flow

The XState machine handles complex game flow including:
- Asset loading → Character creation → Battle rounds
- Turn-based combat with card play, effects, and monster responses  
- Shopping phases between battles
- Card destruction mechanics
- Inventory item usage

### Audio System

Uses Howler.js with the `getSound()` helper for audio management. Sound effects are automatically loaded for each game entity and triggered by state machine actions.