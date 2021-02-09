import React from 'react'
import { motion } from 'framer-motion'
import { rng } from 'src/functions'
import { Wrapper, PortraitImg, Name, Flash } from './AvatarStyles'

const DAMAGE_FLASH_DURATION = 0.33

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

function Portrait(props: PortraitProps) {
  const { isTakingDamage, artwork } = props

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

Portrait.displayName = 'Avatar.Portrait'
Avatar.Portrait = Portrait
Name.displayName = 'Avatar.Name'
Avatar.Name = Name
Flash.displayName = 'Avatar.Flash'
Avatar.Flash = Flash

export default Avatar
