import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { clsx } from 'clsx'
import { EmptyDeck } from './empty-deck'
import css from './deck.module.css'

const STAGGER_DELAY = 0.08

type AnimatedDeckProps = {
  children?: React.ReactNode
}

export function AnimatedDeck({ children }: AnimatedDeckProps) {
  const childArray = React.Children.toArray(children)
  const childKeys = childArray.map((child) => (child as React.ReactElement).key ?? '')

  const prevKeysRef = useRef<string[]>(childKeys)

  const prevKeySet = new Set(prevKeysRef.current)
  const newKeys = childKeys.filter((k) => !prevKeySet.has(k))
  const newKeyOrder = new Map(newKeys.map((k, i) => [k, i]))

  useEffect(() => {
    prevKeysRef.current = childKeys
  })

  return (
    <div className={clsx({ [css['deck']]: true })} data-testid="animated-deck-container">
      {childArray.length === 0 && <EmptyDeck />}
      <AnimatePresence>
        {childArray.map((child, index) => {
          const key = childKeys[index]
          const staggerIndex = newKeyOrder.get(key) ?? -1
          const staggerDelay = staggerIndex >= 0 ? staggerIndex * STAGGER_DELAY : 0
          return (
            <motion.div
              key={key}
              style={{ position: 'absolute', left: `-${index * 5}px`, top: '0', zIndex: index }}
              initial={{ scale: 1.05, y: -20, opacity: 0.5 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -10, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: staggerDelay }}
            >
              {child}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
