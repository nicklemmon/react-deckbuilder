import { Item } from '../../interfaces'
import { getSound } from '../../functions'
import SmallPotionImg from '../../images/small-potion.png'
import LargePotionImg from '../../images/large-potion.png'
import PotionObtainSfx from '../../sounds/potion.obtain.wav'
import PotionUseSfx from '../../sounds/potion.use.wav'
import PotionEffectSfx from '../../sounds/potion.effect.wav'

const getItemSound = (src: string) => getSound({ src })

const smallPotion: Item = {
  id: 'small-potion',
  name: 'Small Potion',
  description: 'Heals the player slightly',
  artwork: SmallPotionImg,
  sfx: {
    obtain: getItemSound(PotionObtainSfx),
    use: getItemSound(PotionUseSfx),
    effect: getItemSound(PotionEffectSfx),
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
    effect: getItemSound(PotionEffectSfx),
  },
  price: 50,
  stats: {
    health: 25,
  },
}

// eslint-disable-next-line
export default [smallPotion, largePotion]
