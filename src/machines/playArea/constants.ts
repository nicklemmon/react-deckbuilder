import uniqueId from 'lodash/uniqueId'
import config from 'src/config'
import { Card, CardStatus } from 'src/interfaces'
import { PlayAreaContext } from './types'

export const PLAY_AREA_MACHINE_ID = 'game-machine'

export const PLAY_AREA_MACHINE_DEFAULT_CONTEXT: PlayAreaContext = {
  player: config.player,
  playerDeck: (config.startingDeck as Array<Card>).map((card, index) => {
    const id = uniqueId(`card-${card.id}-`)

    return {
      ...card,
      id,
      status: CardStatus['face-up'],
    }
  }),
  classDeck: config.cards,
  itemShop: {
    cards: [],
    items: [],
  },
  drawPile: [],
  currentHand: [],
  chosenItem: undefined,
  cardInPlay: undefined,
  cardToDestroy: undefined,
  discardPile: [],
  monster: undefined,
  spoils: {
    gold: 0,
  },
}

export const IMPACT_SFX_VOLUME = 0.33
