import { motion } from 'motion/react'
import { rng } from '../helpers/rng'
import css from './avatar.module.css'

const DAMAGE_FLASH_DURATION = 0.4
const HEALING_FLASH_DURATION = 0.75

export type AvatarStatus = 'idle' | 'taking-damage' | 'healing' | 'dead'

/** Displays the current player character portrait */
export function Avatar({
  src,
  status = 'idle',
  onAnimationComplete,
}: {
  src: string
  status?: AvatarStatus
  onAnimationComplete?: () => void
}) {
  return (
    <div>
      <AvatarAnimationWrapper status={status}>
        <div className={css['avatar']}>
          <img className={css['avatar-img']} src={src} />

          {status === 'taking-damage' ? (
            <DamageFlash onAnimationComplete={onAnimationComplete} />
          ) : null}

          {status === 'healing' ? <HealingFlash onAnimationComplete={onAnimationComplete} /> : null}
        </div>
      </AvatarAnimationWrapper>
    </div>
  )
}

/** Handles shaking the avatar when taking damage */
function AvatarAnimationWrapper({
  children,
  status,
}: {
  children: React.ReactNode
  status: AvatarStatus
}) {
  const animation =
    status === 'taking-damage'
      ? { x: [0, -rng(25), rng(25), rng(-25), 0], y: [0, -rng(15), rng(15), rng(-15), 0] }
      : { x: [0, 0], y: [0, 0] }

  return (
    <motion.div animate={animation} transition={{ duration: DAMAGE_FLASH_DURATION }}>
      {children}
    </motion.div>
  )
}

/** Overlays the avatar and applies a flash when taking damage */
function DamageFlash({ onAnimationComplete }: { onAnimationComplete?: () => void }) {
  return (
    <motion.div
      onAnimationComplete={onAnimationComplete}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--color-stone-100)',
        borderRadius: '50%',
      }}
      animate={{
        opacity: [0, 0.85, 0],
        scale: [0.25, 1.25, 2.75],
      }}
      transition={{ duration: DAMAGE_FLASH_DURATION }}
    />
  )
}

/** Overlays the avatar and applies a flash when healing */
function HealingFlash({ onAnimationComplete }: { onAnimationComplete?: () => void }) {
  return (
    <motion.div
      onAnimationComplete={onAnimationComplete}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--color-success)',
      }}
      animate={{
        opacity: [0, 0.85, 0],
        scale: [0.25, 1.25, 1.25],
        y: [100, 0, 0],
      }}
      transition={{ duration: HEALING_FLASH_DURATION }}
    />
  )
}
