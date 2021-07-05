import { motion } from 'framer-motion'
import { Card } from 'src/components'

interface CardInPlayProps {
  state: any // TODO: Implement real type
}

export function CardInPlay(props: CardInPlayProps) {
  const { state } = props
  const { cardInPlay } = state.context

  return (
    <motion.div
      key="card-in-play"
      initial={{ y: 100, opacity: 0, x: 0, scale: 1 }}
      animate={{ y: -50, opacity: 1, x: 0, scale: 1.05 }}
      exit={{ y: 175, x: 425, opacity: 0, rotate: 15, scale: 1 }}
      transition={{ type: 'spring', damping: 5, mass: 0.125, stiffness: 30 }}
    >
      <Card isDisabled={false} cardIndex={0} {...cardInPlay} />
    </motion.div>
  )
}
