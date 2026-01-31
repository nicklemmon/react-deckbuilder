/** Animation variants for screen transitions */
export const screenTransitionVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

/** Transition configuration for screen animations */
export const screenTransitionConfig = {
  duration: 0.4,
  ease: 'easeInOut' as const,
}
