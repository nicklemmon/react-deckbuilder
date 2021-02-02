import React from 'react'
import { Howl } from 'howler'
import { motion } from 'framer-motion'
import { rng } from 'src/functions'
import { Wrapper, PortraitImg, Name, Flash, FeedbackText } from './AvatarStyles'
import impactSound from 'src/sounds/impact.slice.wav'

const DAMAGE_FLASH_DURATION = 0.33
const DAMAGE_FEEDBACK_DURATION = 0.8

interface AvatarProps {
  children: any
}

interface PortraitProps {
  artwork?: string
  isTakingDamage: boolean
}

interface PortraitWrapperProps {
  isTakingDamage: boolean
  children: any
}

interface FeedbackProps {
  children: any
}

function Portrait(props: PortraitProps) {
  const { isTakingDamage, artwork } = props

  React.useEffect(() => {
    const sound = new Howl({ src: [impactSound] })

    if (isTakingDamage) {
      sound.play()
    }
  }, [isTakingDamage])

  return (
    <PortraitWrapper isTakingDamage={isTakingDamage}>
      <PortraitImg artwork={artwork}>{isTakingDamage ? <DamageFlash /> : null}</PortraitImg>
    </PortraitWrapper>
  )
}

function Avatar(props: AvatarProps) {
  const { children } = props

  return <Wrapper>{children}</Wrapper>
}

function PortraitWrapper(props: PortraitWrapperProps) {
  const { children, isTakingDamage = false } = props

  return (
    <>
      {isTakingDamage ? (
        <motion.div
          animate={{ x: [0, -rng(25), rng(10), rng(-10), 0], y: [0, -rng(5), rng(5), rng(5), 0] }}
          transition={{ duration: DAMAGE_FLASH_DURATION }}
        >
          {children}
        </motion.div>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

function DamageFlash() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '50%',
      }}
      animate={{
        opacity: [0, 0.85, 0],
        scale: [0.25, 1.25, 1.25],
      }}
      transition={{ duration: DAMAGE_FLASH_DURATION }}
    />
  )
}

function Feedback(props: FeedbackProps) {
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

Portrait.displayName = 'Avatar.Portrait'
Avatar.Portrait = Portrait
Name.displayName = 'Avatar.Name'
Avatar.Name = Name
Flash.displayName = 'Avatar.Flash'
Avatar.Flash = Flash
Feedback.displayName = 'Avatar.Feedback'
Avatar.Feedback = Feedback

export default Avatar
