# Domain Context

Domain language for react-deckbuilder. These terms name the seams in the game logic; use them
exactly in code, comments, and reviews.

## Game state

**Run** — one playthrough: persists across battles. Holds run-level resources on `game.player`
(`gold`, `deck`, `inventory`, `characterClass`, and the player's combat `stats` — `maxHealth`,
`health`, `defense`). These survive every new battle.

**Battle** — one fight against one monster. Its ephemeral state lives in `game.battle` and is wiped
and rebuilt on each `NewRound`: `monster`, `hand`, `drawPile`, `discardPile`, `cardInPlay`,
`itemInPlay`. Player combat stats deliberately do **not** live here — they are run-level.

**BattleState** — the value the battle resolvers operate on. Assembled at the seam from
`game.player` (combat `stats` + `status`) and `game.battle` (the ephemeral fields) by
`toBattleState(game)`, and written back to both by `writeBattleState(game, next)`. See
`src/machines/app-machine/battle-state.ts`.

## Battle module

**Resolver** — a pure function `(BattleState, …args, deps?) -> { state, cues }`. No I/O, no audio,
no randomness except through an injected `Rng`. The resolvers are the test surface for game rules;
they are exercised directly, without booting the XState actor. Live in
`src/machines/app-machine/battle.ts`. First three: `resolveCardPlay` (card damages monster),
`resolveMonsterAttack` (monster damages player, mitigated by defense), `resolveItemUse` (item heals
player). These three are deterministic — they take no `Rng`.

## Cue

**Cue** — a semantic descriptor of a sound a reducer wants played, returned/stashed as data rather
than played inline (e.g. `{ type: 'card-hit' }`). Reducers stay pure; a single `playCues` action
drains `game.pendingCues`, maps each `Cue` to its `Howl` (reading entity `sfx` from context), and
plays it. This is the one channel through which any reducer requests audio. Defined in
`src/machines/app-machine/cues.ts`. Sounds already fired from sibling action literals (button click,
door, win, lose, music) are not cues — they were never inside an `assign`.

## Rng

**Rng** — the injectable seam over all gameplay nondeterminism:
`{ int(maxExclusive), shuffle(xs), id() }`. `int` returns `[0, maxExclusive)`. `id()` replaces
`crypto.randomUUID()`. Two adapters: `MathRandomRng` (prod, a module singleton) and `SeededRng`
(tests). Lives in `src/helpers/rng.ts`. Presentation-only randomness (e.g. avatar UI jitter) is
**not** gameplay nondeterminism and must not go through this seam.
