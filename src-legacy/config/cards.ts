import { getSound } from '../functions'
import type { Card } from '../interfaces/Card'

const cards = import.meta.glob('../cards/**/config.ts', { eager: true, import: 'default' })
const cardsSfx = import.meta.glob('../cards/**/*.wav', { eager: true, import: 'default' })
const cardsArtwork = import.meta.glob('../cards/**/*.png', {
  eager: true,
  import: 'default',
})

/** Array of available cards derived from `src/cards` file contents */
const cardsArr = Object.entries(cards).map(([path, mod]) => {
  const dir = path.replace('/config.ts', '')
  const id = dir.replace('../cards/', '')

  return {
    ...(mod as Card),
    id,
    artwork: cardsArtwork[`${dir}/artwork.png`],
    sfx: getSound({ src: cardsSfx[`${dir}/sfx.wav`] as string }),
  }
}) as Array<Card>

export default cardsArr
