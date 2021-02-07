import React from 'react'
import { motion } from 'framer-motion'
import { FeedbackText } from './FeedbackStyles'

const DAMAGE_FEEDBACK_DURATION = 0.8

interface FeedbackProps {
  children: any
}

export function Feedback(props: FeedbackProps) {
  const { children } = props

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '25%',
        right: '25%',
      }}
      animate={{
        y: [0, -50, -100],
        scale: [1, 1.25, 1.5],
        opacity: [0, 1, 0],
      }}
      transition={{ duration: DAMAGE_FEEDBACK_DURATION }}
    >
      <FeedbackText>-{children}</FeedbackText>
    </motion.div>
  )
}
