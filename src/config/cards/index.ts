import Card from 'src/interfaces/Card'
import fireboltImg from 'src/images/firebolt.png'
import knucklesImg from 'src/images/knuckles.png'
import handAxeImg from 'src/images/hand-axe.png'
import earthquakeImg from 'src/images/earthquake.png'
import lightningImg from 'src/images/lightning.png'
import stilletoImg from 'src/images/stilleto.png'
import shieldImg from 'src/images/shield.png'

const strike: Card = {
  id: 'strike',
  name: 'Strike',
  artwork: handAxeImg,
  description: 'Smack your opponent!',
  rarity: 0,
  stats: {
    attack: 3,
  },
}

const shieldSlam: Card = {
  id: 'shield-slam',
  name: 'Shield Slam',
  artwork: shieldImg,
  description: 'Slam your shield, creating a shockwave',
  rarity: 3,
  stats: {
    defense: 1,
    attack: 5,
  },
}

const assassinate: Card = {
  id: 'assassinate',
  name: 'Assassinate',
  artwork: stilletoImg,
  description: 'Back stab for huge damage!',
  rarity: 1,
  stats: {
    attack: 8,
  },
}

const punch: Card = {
  id: 'punch',
  name: 'Punch',
  artwork: knucklesImg,
  description: 'Right in the ribs',
  rarity: 0,
  stats: {
    attack: 1,
  },
}

const firebolt: Card = {
  id: 'firebolt',
  name: 'Firebolt',
  artwork: fireboltImg,
  description: 'A burst of directed flames',
  rarity: 2,
  stats: {
    attack: 9,
  },
}

const earthquake: Card = {
  id: 'earthquake',
  name: 'Earthquake',
  artwork: earthquakeImg,
  description: 'The earth split in two',
  rarity: 3,
  stats: {
    attack: 12,
  },
}

const lightning: Card = {
  id: 'lightning',
  name: 'Lightning',
  artwork: lightningImg,
  description: 'A flash in the pan',
  rarity: 2,
  stats: {
    attack: 7,
  },
}

export const cards = [strike, shieldSlam, assassinate, punch, firebolt, earthquake, lightning]

export const startingDeck = [punch, punch, punch, strike, strike, firebolt]
