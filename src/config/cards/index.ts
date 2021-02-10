import { getSound } from 'src/functions'
import Card from 'src/interfaces/Card'
import fireboltImg from 'src/images/firebolt.png'
import knucklesImg from 'src/images/knuckles.png'
import handAxeImg from 'src/images/hand-axe.png'
import earthquakeImg from 'src/images/earthquake.png'
import lightningImg from 'src/images/lightning.png'
import stilletoImg from 'src/images/stilleto.png'
import shieldImg from 'src/images/shield.png'
import meleeHeavySound from 'src/sounds/melee.heavy.wav'
import magicFireBoltSound from 'src/sounds/magic.firebolt.wav'
import magicLightningSound from 'src/sounds/magic.lightning.wav'
import magicEarthSound from 'src/sounds/magic.earth.wav'
import meleeWooshSound from 'src/sounds/melee.woosh.flac'
import meleeSheatheSound from 'src/sounds/melee.sheathe.wav'
import meleeShieldSound from 'src/sounds/melee.shield.wav'

const strike: Card = {
  id: 'strike',
  name: 'Strike',
  artwork: handAxeImg,
  sfx: meleeHeavySound,
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
  sfx: meleeShieldSound,
  description: 'Slam your shield, creating a shockwave',
  rarity: 3,
  price: 18,
  stats: {
    defense: 1,
    attack: 5,
  },
}

const assassinate: Card = {
  id: 'assassinate',
  name: 'Assassinate',
  artwork: stilletoImg,
  sfx: meleeSheatheSound,
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
  sfx: meleeWooshSound,
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
  sfx: magicFireBoltSound,
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
  sfx: magicEarthSound,
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
  sfx: magicLightningSound,
  description: 'A flash in the pan',
  rarity: 2,
  price: 12,
  stats: {
    attack: 7,
  },
}

function transformCard(card: Card) {
  return {
    ...card,
    sfx: getSound({ src: card.sfx }),
  }
}

export const cards = [strike, shieldSlam, assassinate, punch, firebolt, earthquake, lightning].map(
  transformCard,
)

export const startingDeck = [firebolt, firebolt, lightning, earthquake].map(transformCard)
