import { Item } from 'src/interfaces'
import { getSound } from 'src/functions'
import SmallPotionImg from 'src/images/small-potion.png'
import LargePotionImg from 'src/images/large-potion.png'
import PotionObtainSfx from 'src/sounds/potion.obtain.wav'
import PotionUseSfx from 'src/sounds/potion.use.wav'

const getItemSound = (src: string) => getSound({ src })

const smallPotion: Item = {
  id: 'small-potion',
  name: 'Small Potion',
  description: 'Heals the player slightly',
  artwork: SmallPotionImg,
  sfx: {
    obtain: getItemSound(PotionObtainSfx),
    use: getItemSound(PotionUseSfx),
  },
  price: 30,
  stats: {
    health: 10,
  },
}

const largePotion: Item = {
  id: 'large-potion',
  name: 'Large Potion',
  description: 'Heals the player significantly',
  artwork: LargePotionImg,
  sfx: {
    obtain: getItemSound(PotionObtainSfx),
    use: getItemSound(PotionUseSfx),
  },
  price: 50,
  stats: {
    health: 25,
  },
}

// eslint-disable-next-line
export default [smallPotion, largePotion]
