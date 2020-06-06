import React from 'react'
import { motion } from 'framer-motion'
import rng from 'src/functions/rng'
import styled from 'styled-components'

const DAMAGE_DURATION = 0.33
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

const PortraitImg = styled.div<{ artwork?: string }>`
  position: relative;
  overflow: hidden;
  height: 10rem;
  width: 10rem;
  padding: 1rem;
  background-image: ${props => `url(${props.artwork})`};
  background-size: cover;
  border-radius: 50%;
  border: ${props => props.theme.space[1]} solid ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows[0]};
  margin-bottom: ${props => props.theme.space[3]};
`

const Stats = styled.div`
  color: ${props => props.theme.colors.darkGray};
  text-align: center;
`

const Stat = styled.div`
  color: ${props => props.theme.colors.gray};
  font-family: ${props => props.theme.fonts.body};
  font-size: ${props => props.theme.fontSizes[1]};
  margin-top: ${props => props.theme.space[1]};
`

const Name = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: 0.0125rem;
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: 700;
`

const Flash = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.white};
`

function Portrait(props: PortraitProps) {
  const { isTakingDamage, artwork } = props

  return (
    <PortraitWrapper isTakingDamage={isTakingDamage}>
      <PortraitImg artwork={artwork}>{isTakingDamage && <DamageFlash />}</PortraitImg>
    </PortraitWrapper>
  )
}

function Avatar(props: AvatarProps) {
  const { children } = props

  return <div>{children}</div>
}

function PortraitWrapper(props: PortraitWrapperProps) {
  const { children, isTakingDamage = false } = props

  return (
    <>
      {isTakingDamage ? (
        <motion.div
          animate={{ x: [0, -rng(25), rng(10), rng(-10), 0], y: [0, -rng(5), rng(5), rng(5), 0] }}
          transition={{ duration: DAMAGE_DURATION }}
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
      transition={{ duration: DAMAGE_DURATION }}
    />
  )
}

Portrait.displayName = 'Avatar.Portrait'
Avatar.Portrait = Portrait
Stats.displayName = 'Avatar.Stats'
Avatar.Stats = Stats
Stat.displayName = 'Avatar.Stat'
Avatar.Stat = Stat
Name.displayName = 'Avatar.Name'
Avatar.Name = Name
Flash.displayName = 'Avatar.Flash'
Avatar.Flash = Flash

export default Avatar
