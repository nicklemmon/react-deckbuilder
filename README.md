# [React Deckbuilder](https://deckbuilder.nicklemmon.com)

A simple [deck-building game](https://en.wikipedia.org/wiki/Deck-building_game) built with React and
[XState](https://xstate.js.org/).

## Local development

```bash
npm start
```

### Card finishes demo

Open `/card-finishes` on the development server. Compare four CSS finishes with the original card,
change artwork, adjust each finish's strength, and pause the animated light. The effects follow the
card's hover position and respect reduced motion settings.

Reuse a finish through the existing card component:

```tsx
<Card {...card} finish="prismatic" finishIntensity={0.6} finishAnimated />
```

Each finish has its own default strength in `CARD_FINISH_DEFAULTS` in
`src/components/card-finish.tsx`. Omit `finishIntensity` to use it. Demo adjustments last until the
page reloads; **Reset all strengths** restores these defaults.

Available finishes: `none` (default), `foil` (30%), `prismatic` (60%), `gold` (50%), and `ember`
(85%). These are decorative CSS gradients and blend modes, not WebGL shaders. Names, descriptions,
and attack values stay above the effects; face-down cards do not render the finish. No gameplay
rarities or rewards are changed by the demo.

## Production

```bash
npm run build
```

## AI use

### Coding

This project was initially built _before_ the LLM explosion, however, it's now a great place to
explore the capabilities of available models. Some code within the project is authored using
[Claude Code](https://claude.ai).

### Imagery

The majority of the images used in the game are AI generated, most recently using Nano Banana. Image
models used:

- [Flux v1](https://bfl.ai/)
- [Nano banana pro](https://gemini.google.com/)
- [ChatGPT](https://chatgpt.com)

### Audio

For now, the audio is stems from royalty free sound effects and music packs from
[Humble Bundle](https://humblebundle.com). These assets are _not_ AI-generated.
