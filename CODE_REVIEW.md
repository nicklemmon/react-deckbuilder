# Code Review: React Deck-Building Game

**CODE REVIEWED BY CLAUDE!**

**Overall Quality: 7/10** - Solid foundations with room for improvement

---

## ✅ Strengths

- **Excellent architecture** - Clean separation of concerns, modular file structure
- **Modern tooling** - Vite, TypeScript strict mode, XState v5, Motion animations
- **Convention-based design** - Auto-discovery of cards/monsters/items via `import.meta.glob`
- **Good component patterns** - Reusable UI components with proper TypeScript typing
- **Design token system** - CSS custom properties for consistent styling

---

## ⚠️ Priority 1: Critical Issues

### 1. Error Handling (HIGH IMPACT)

**Problems:**

- `LoadingAssetsError` state has no recovery mechanism (dead-end state)
- Asset loading fails silently: `img.onerror = () => resolve(null)`
- No React Error Boundaries
- No validation before using game entities

**Fix:**

```typescript
// src/machines/app-machine/app-machine.ts:489
LoadingAssetsError: {
  on: {
    RETRY_LOADING: {
      target: 'LoadingAssets'
    }
  }
}

// Add error aggregation in prefetchAssets (lines 94-113)
img.onerror = () => reject(new Error(`Failed to load: ${src}`))
```

**Action Items:**

- [ ] Add retry logic to `LoadingAssetsError` state
- [ ] Create React `ErrorBoundary` component wrapper
- [ ] Validate entities exist in `getCard()`, `getMonster()`, etc.
- [ ] Log asset failures with details

---

### 2. Test Coverage (HIGH IMPACT)

**Current State:**

- Only 5 component tests (Button, Avatar, HealthBar, Inline, Stack)
- **Zero state machine tests** (0/900 lines covered)
- No helper function tests
- No integration tests
- **Coverage: ~10%**

**Required Tests:**

```typescript
// Create: src/machines/app-machine/__tests__/app-machine.test.ts
describe('Combat Flow', () => {
  it('should apply damage to monster')
  it('should transition to Victory when monster dies')
  it('should transition to Defeat when player dies')
})

describe('Shop Flow', () => {
  it('should allow purchasing cards with sufficient gold')
  it('should prevent purchases without gold')
})
```

**Action Items:**

- [ ] Test all state machine flows (combat, shopping, character creation)
- [ ] Test helper functions (`getCard`, `getAllMonsters`, etc.)
- [ ] Add integration tests for full game flows
- [ ] **Target: 70% coverage**

---

### 3. Type Safety (HIGH IMPACT)

**Problems:**

- 15+ uses of `any` type
- Helper functions use type assertions instead of handling `undefined`
- `@ts-expect-error` suppresses issues instead of fixing them

**Locations:**

```typescript
// src/helpers/vite.ts:6-7 - Uses Record<string, any>
// src/machines/app-machine/app-machine.ts:70-75 - (module: any)
// src/app.tsx:50 - @ts-expect-error for CREATE_CHARACTER
// src/helpers/cards.ts:11 - getCard returns `as Card` (no null check)
```

**Fix:**

```typescript
// Better typing for helpers
export function getCard(id: string, deck: Array<Card>): Card | undefined {
  return deck.find((card) => card.id === id)
}

// Fix vite.ts module resolution
export function resolveModules<T>(modules: Record<string, { default?: T }>): Array<T> {
  return Object.values(modules)
    .map((module) => module.default)
    .filter((item): item is T => item !== undefined)
}
```

**Action Items:**

- [ ] Remove all `any` types
- [ ] Return `T | undefined` from helpers (handle undefined at call sites)
- [ ] Fix `@ts-expect-error` by properly typing form data
- [ ] Add null checks before using optional values

---

## ⚠️ Priority 2: Design Improvements

### 4. State Machine Complexity (MEDIUM IMPACT)

**Problem:**

- Single 892-line state machine handles everything
- 23 states mix concerns (combat, shopping, UI animations)
- Animation completion events pollute the machine

**Recommendation: Split into 3 machines**

```typescript
// Main orchestrator (simplified)
const gameMachine = {
  states: {
    loading: {},
    modeSelection: {},
    characterCreation: {},
    combat: { invoke: { src: 'combatMachine' } },
    betweenRounds: {},
    shop: { invoke: { src: 'shopMachine' } },
  },
}

// Combat sub-machine (focused on turn-based flow)
const combatMachine = {
  states: {
    surveying: {},
    drawing: {},
    playerChoosing: {},
    cardInPlay: {},
    applyingEffects: {},
    defending: {},
  },
}

// Shop sub-machine
const shopMachine = {
  states: {
    browsing: {},
    purchasingCard: {},
    destroyingCard: {},
  },
}
```

**Benefits:**

- Each machine is testable independently
- Clearer separation of concerns
- Easier to add new features

---

### 5. Animation Coupling (MEDIUM IMPACT)

**Problem:**

- State transitions depend on component animation callbacks
- 7+ animation completion events create tight coupling
- Fragile temporal coupling between UI and state machine

**Fix:**

```typescript
// Add timeout fallbacks
CardInPlay: {
  after: {
    500: 'ApplyingCardEffects'  // Timeout fallback
  },
  on: {
    PLAY_CARD_ANIMATION_COMPLETE: 'ApplyingCardEffects'  // Or complete early
  }
}

// Or unify animation events
type AnimationCompleteEvent = {
  type: 'ANIMATION_COMPLETE'
  animation: 'card_play' | 'card_effect' | 'monster_death'
}
```

---

### 6. Sound Management (MEDIUM IMPACT)

**Problem:**

- Sounds hardcoded in state machine actions
- TODO: "We really need to keep these somewhere else" (line 48)
- No orchestration (sounds can overlap)

**Fix:**

```typescript
// Create: src/systems/sound-manager.ts
class SoundManager {
  private sounds = new Map<string, Howl>()

  register(id: string, sound: Howl) {
    this.sounds.set(id, sound)
  }

  play(id: string, volume?: number) {
    this.sounds.get(id)?.play()
  }
}

// In state machine
actions: {
  playImpactSound: () => soundManager.play('impact')
}
```

---

## 🔧 Priority 3: Quick Wins

### 7. Code Cleanup (LOW EFFORT, MEDIUM IMPACT)

**Remove debug code:**

```typescript
// src/machines/app-machine/app-machine.ts:871
console.log('event.data.card', event.data.card) // DELETE

// src/app.tsx:395
console.log('here') // DELETE
```

**Complete TODOs:**

```typescript
// src/types/cards.ts:13
align?: 'left' | 'right'  // TODO: Can this be removed?  → YES, REMOVE IT

// src/machines/app-machine/app-machine.ts:48
// TODO: We really need to keep these somewhere else  → Fix in Priority 2

// src/app.tsx:128
// TODO: This is the wrong value!  → Fix damage calculation
```

**Action Items:**

- [ ] Remove all `console.log` statements (2 found)
- [ ] Remove unused `align` prop from Card type
- [ ] Complete or delete all TODO comments

---

### 8. Performance Optimizations (LOW-MEDIUM EFFORT)

**Issues:**

```typescript
// src/helpers/cards.ts:11 - Unnecessary array copy
export function getCard(id: string, deck: Array<Card>): Card {
  return [...deck].find((card) => card.id === id) as Card // ❌ Don't spread
}

// Fix:
return deck.find((card) => card.id === id) // ✅ Direct find
```

**Add memoization:**

```typescript
// components/card.tsx
export const Card = React.memo(function Card(props: CardProps) {
  // Implementation
})

// app.tsx - Memoize expensive filters
const affordableCards = useMemo(
  () => context.game.shop.cards.filter((card) => context.game.player.gold >= card.price),
  [context.game.shop.cards, context.game.player.gold],
)
```

**Action Items:**

- [ ] Remove unnecessary `[...deck]` spreads in helpers
- [ ] Add `React.memo()` to `Card`, `ItemShopCard`, `Avatar`
- [ ] Use `useMemo()` for expensive list operations

---

### 9. Prop Type Cleanup

**Issues:**

```typescript
// types/cards.ts - Remove unused align prop
export type Card = {
  align?: 'left' | 'right'  // ❌ TODO: Can this be removed?
}

// components/item-shop-card.tsx - Don't spread entire CardType
export function ItemShopCard({ ...props }: CardType & { ... }) {
  return <Card {...props} />  // ❌ Type conflicts
}
```

**Fix:**

```typescript
type ItemShopCardProps = {
  id: string
  name: string
  artwork: string
  stats: CardStats
  price: number
  shopStatus: ItemShopCardStatus
  onClick: () => void
}
```

---

## 📚 Priority 4: Documentation

### 10. Add JSDoc Comments

**Current:** Types lack explanatory comments

**Fix:**

```typescript
/**
 * Represents a playable card in the game.
 * Cards can exist in multiple states (deck, hand, in-play, discarded).
 */
export type Card = {
  /** Unique identifier for this card instance (includes UUID suffix) */
  id: string

  /** Display name shown on the card */
  name: string

  /** Path to card artwork image */
  artwork: string

  /** Visual orientation in UI */
  orientation?: 'face-up' | 'face-down'

  /** Current card state for styling/interaction */
  status?: CardStatus
}
```

---

### 11. Setup XState Inspector

**Install devtools:**

```bash
npm install --save-dev @statelyai/inspect
```

**Setup (dev only):**

```typescript
// main.tsx
import { createBrowserInspector } from '@statelyai/inspect'

if (import.meta.env.DEV) {
  createBrowserInspector()
}
```

---

## 📊 Metrics Dashboard

| Metric            | Current       | Target           |
| ----------------- | ------------- | ---------------- |
| Test Coverage     | ~10%          | 70%+             |
| `any` usage       | 15+ instances | 0                |
| State Machine LoC | 892 lines     | <500 per machine |
| `console.log`     | 2+            | 0                |
| Completed TODOs   | 0/8           | 8/8              |
| Error Boundaries  | 0             | 1+               |

---

## 🗓️ 4-Week Implementation Plan

### Week 1: Foundation (Critical)

- [ ] Add error recovery to `LoadingAssetsError` state
- [ ] Create React `ErrorBoundary` component
- [ ] Fix type safety (remove `any`, proper null handling)
- [ ] Write basic state machine tests

### Week 2: Quality

- [ ] Remove debug `console.log` statements
- [ ] Complete or remove TODO comments
- [ ] Add JSDoc to type definitions
- [ ] Performance optimizations (memo, useMemo)

### Week 3: Architecture

- [ ] Plan state machine split (document boundaries)
- [ ] Refactor sound management system
- [ ] Add animation timeout fallbacks
- [ ] Write integration tests

### Week 4: Polish

- [ ] Expand test coverage to 70%
- [ ] Setup XState inspector for dev
- [ ] Document architecture decisions
- [ ] Performance profiling

---

## 📁 Key Files to Modify

- `src/machines/app-machine/app-machine.ts` (892 lines) - State machine
- `src/app.tsx` (450 lines) - Root component
- `src/helpers/vite.ts` - Module resolution
- `src/helpers/cards.ts` - Card helpers
- `src/helpers/monsters.ts` - Monster helpers
- `src/types/cards.ts` - Card types
- `src/components/character-creation.tsx` - Character creation

---

## Summary

**Strong foundations** with modern tooling and clear architecture. Main areas for growth:

1. **Robustness** - Error handling and recovery
2. **Maintainability** - Test coverage and type safety
3. **Scalability** - State machine complexity management
4. **Quality** - Remove debug code, complete TODOs

Addressing Priority 1 items will have the highest impact on production readiness.
