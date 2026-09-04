import { motion } from 'motion/react'
import { cx } from '../helpers/css'
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
  onAnimationComplete?: (() => void) | undefined
}) {
  return (
    <motion.div
      key={`feedback-${variant}-${orientation}`}
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
      {...(onAnimationComplete ? { onAnimationComplete } : {})}
    >
      <div
        className={cx(css, {
          'feedback-text': true,
          neutral: variant === 'neutral',
          negative: variant === 'negative',
          positive: variant === 'positive',
        })}
      >
        {variant === 'positive' && '+'}

        {variant === 'negative' && '-'}

        {children}
      </div>
    </motion.div>
  )
}
