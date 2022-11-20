import { motion } from 'framer-motion'
import { Card } from '../../Card'
import { Card as CardInterface } from '../../../interfaces'

interface CardToDestroyProps {
  cardToDestroy: CardInterface
}

export function CardToDestroy({ cardToDestroy }: CardToDestroyProps) {
  return (
    <motion.div
      key="card-to-destroy"
      initial={{ y: 0, opacity: 0.5, scale: 1 }}
      animate={{ y: 0, opacity: 1, scale: 1.25 }}
      exit={{ y: -150, opacity: 0, scale: 1.25 }}
      transition={{ type: 'spring', damping: 5, mass: 0.125, stiffness: 30 }}
    >
      <Card cardIndex={0} {...cardToDestroy} />
    </motion.div>
  )
}
