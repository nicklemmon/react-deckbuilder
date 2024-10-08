import { getSound } from '../../functions'
import { Card, Deck } from '../../interfaces'
import fireboltImg from '../../images/firebolt.png'
import knucklesImg from '../../images/knuckles.png'
import strikeImg from '../../images/strike.png'
import earthquakeImg from '../../images/earthquake.png'
import lightningImg from '../../images/lightning.png'
import stilletoImg from '../../images/stilleto.png'
import shieldImg from '../../images/shield.png'
import meleeHeavySound from '../../sounds/melee.heavy.wav'
import magicFireBoltSound from '../../sounds/magic.firebolt.wav'
import magicLightningSound from '../../sounds/magic.lightning.wav'
import magicEarthSound from '../../sounds/magic.earth.wav'
import meleeWooshSound from '../../sounds/melee.woosh.flac'
import meleeSheatheSound from '../../sounds/melee.sheathe.wav'
import meleeShieldSound from '../../sounds/melee.shield.wav'

const strike: Card = {
  id: 'strike',
  name: 'Strike',
  artwork: strikeImg,
  sfx: getSound({ src: meleeHeavySound }),
  description: 'Smack your opponent!',
  rarity: 0,
  price: 14,
  stats: {
    attack: 3,
  },
}

const shieldSlam: Card = {
  id: 'shield-slam',
  name: 'Shield Slam',
  artwork: shieldImg,
  sfx: getSound({ src: meleeShieldSound }),
  description: 'Slam your shield, creating a shockwave',
  rarity: 3,
  price: 18,
  stats: {
    attack: 5,
  },
}

const assassinate: Card = {
  id: 'assassinate',
  name: 'Assassinate',
  artwork: stilletoImg,
  sfx: getSound({ src: meleeSheatheSound }),
  description: 'Back stab for huge damage!',
  rarity: 1,
  price: 14,
  stats: {
    attack: 8,
  },
}

const punch: Card = {
  id: 'punch',
  name: 'Punch',
  artwork: knucklesImg,
  sfx: getSound({ src: meleeWooshSound }),
  description: 'Right in the ribs',
  rarity: 0,
  price: 8,
  stats: {
    attack: 1,
  },
}

const firebolt: Card = {
  id: 'firebolt',
  name: 'Firebolt',
  artwork: fireboltImg,
  sfx: getSound({ src: magicFireBoltSound }),
  description: 'A burst of directed flames',
  rarity: 2,
  price: 15,
  stats: {
    attack: 9,
  },
}

const earthquake: Card = {
  id: 'earthquake',
  name: 'Earthquake',
  artwork: earthquakeImg,
  sfx: getSound({ src: magicEarthSound }),
  description: 'The earth split in two',
  rarity: 3,
  price: 25,
  stats: {
    attack: 12,
  },
}

const lightning: Card = {
  id: 'lightning',
  name: 'Lightning',
  artwork: lightningImg,
  sfx: getSound({ src: magicLightningSound }),
  description: 'A flash in the pan',
  rarity: 2,
  price: 12,
  stats: {
    attack: 7,
  },
}

export const cards: Deck = [strike, shieldSlam, assassinate, punch, firebolt, earthquake, lightning]

export const startingDeck: Deck = [firebolt, firebolt, lightning, earthquake, strike, strike]
