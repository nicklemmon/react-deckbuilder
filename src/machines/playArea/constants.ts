import config from 'src/config'
import { Card } from 'src/interfaces'
import { PlayAreaContext } from './types'

export const PLAY_AREA_MACHINE_ID = 'game-machine'

export const PLAY_AREA_MACHINE_DEFAULT_CONTEXT: PlayAreaContext = {
  player: config.player,
  playerDeck: (config.startingDeck as Array<Card>).map((card, index) => {
    return {
      ...card,
      id: `${card.id}-${index}`,
      overlayVariant: 'none',
    }
  }),
  classDeck: config.cards,
  itemShop: {
    cards: [],
  },
  drawPile: [],
  currentHand: [],
  cardInPlay: undefined,
  discardPile: [],
  monster: undefined,
  spoils: {
    gold: 0,
  },
}

export const IMPACT_SFX_VOLUME = 0.33