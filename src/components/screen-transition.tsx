import { motion } from 'motion/react'
import { screenTransitionVariants, screenTransitionConfig } from '../helpers/screen-transitions'

type ScreenTransitionProps = {
  children: React.ReactNode
  /** Unique key for AnimatePresence tracking */
  screenKey: string
}

/**
 * Wrapper component that provides smooth entrance/exit animations for screens.
 * Must be used as a direct child of AnimatePresence.
 */
export function ScreenTransition({ children, screenKey }: ScreenTransitionProps) {
  return (
    <motion.div
      key={screenKey}
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={screenTransitionVariants}
      transition={screenTransitionConfig}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </motion.div>
  )
}
