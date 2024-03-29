import { motion } from 'framer-motion'
import { FeedbackText } from './styles'

const FEEDBACK_DURATION = 0.8

interface FeedbackProps {
  children: any
  variant: 'neutral' | 'positive' | 'negative'
  duration?: number
  orientation?: 'bottom' | 'top'
}

export function Feedback(props: FeedbackProps) {
  const { children, duration = FEEDBACK_DURATION, variant, orientation = 'top' } = props

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: orientation === 'top' ? '25%' : '75%',
        right: orientation === 'top' ? '25%' : '75%',
      }}
      animate={{
        y: [0, -115],
        scale: [1, 1.5],
        opacity: [1, 1, 0],
      }}
      transition={{ duration }}
    >
      <FeedbackText variant={variant}>
        {variant === 'positive' && '+'}

        {variant === 'negative' && '-'}

        {children}
      </FeedbackText>
    </motion.div>
  )
}
