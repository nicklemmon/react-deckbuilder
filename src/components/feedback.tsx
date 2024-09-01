import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import css from './feedback.module.css'

const FEEDBACK_DURATION = 1.0

export function Feedback({
  children,
  variant,
  duration = FEEDBACK_DURATION,
  orientation = 'top',
  onAnimationComplete,
}: {
  children: React.ReactNode
  variant: 'neutral' | 'positive' | 'negative'
  duration?: number
  orientation?: 'bottom' | 'top'
  onAnimationComplete?: () => void
}) {
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
      onAnimationComplete={onAnimationComplete}
    >
      <div
        className={clsx({
          [css['feedback-text']]: true,
          [css['neutral']]: variant === 'neutral',
          [css['negative']]: variant === 'negative',
          [css['positive']]: variant === 'positive',
        })}
      >
        {variant === 'positive' && '+'}

        {variant === 'negative' && '-'}

        {children}
      </div>
    </motion.div>
  )
}
