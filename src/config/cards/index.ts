import Card from 'src/interfaces/Card'
import fireboltImg from 'src/images/firebolt.png'
import knucklesImg from 'src/images/knuckles.png'
import handAxeImg from 'src/images/hand-axe.png'
import earthquakeImg from 'src/images/earthquake.png'
import lightningImg from 'src/images/lightning.png'
import stilletoImg from 'src/images/stilleto.png'
import shieldImg from 'src/images/shield.png'

// Sound effects
const magicFireBoltSound = require('src/sounds/magic.firebolt.wav')
const magicLightningSound = require('src/sounds/magic.lightning.wav')
const magicEarthSound = require('src/sounds/magic.earth.wav')
const meleeHeavySound = require('src/sounds/melee.heavy.wav')
const meleeWooshSound = require('src/sounds/melee.woosh.flac')
const meleeSheatheSound = require('src/sounds/melee.sheathe.wav')
const meleeShieldSound = require('src/sounds/melee.shield.wav')

const strike: Card = {
  id: 'strike',
  name: 'Strike',
  artwork: handAxeImg,
  sound: meleeHeavySound,
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
  sound: meleeShieldSound,
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
  sound: meleeSheatheSound,
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
  sound: meleeWooshSound,
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
  sound: magicFireBoltSound,
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
  sound: magicEarthSound,
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
  sound: magicLightningSound,
  description: 'A flash in the pan',
  rarity: 2,
  price: 12,
  stats: {
    attack: 7,
  },
}

export const cards = [strike, shieldSlam, assassinate, punch, firebolt, earthquake, lightning]

export const startingDeck = [earthquake, earthquake, earthquake]
