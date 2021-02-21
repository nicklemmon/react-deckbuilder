import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Button, ButtonVariant } from 'src/components/Button'
import { Banner } from 'src/components/Banner'

interface VictoryBannerProps {
  send: any // TODO: Implement real type
}

const DefeatText = styled.p`
  width: 100%;
`

export function VictoryBanner(props: VictoryBannerProps) {
  const { send } = props

  return (
    <AnimatedBanner>
      Victory!
      <Button
        style={{ marginLeft: '1rem' }}
        variant={ButtonVariant['primary']}
        onClick={() => send('ITEM_SHOP_CLICK')}
      >
        Item Shop
      </Button>
      <Button
        style={{ marginLeft: '1rem' }}
        variant={ButtonVariant['secondary']}
        onClick={() => send('NEXT_BATTLE_CLICK')}
      >
        Next Battle
      </Button>
    </AnimatedBanner>
  )
}

export function DefeatBanner() {
  return (
    <AnimatedBanner>
      <DefeatText>Defeat!</DefeatText>
    </AnimatedBanner>
  )
}

interface AnimatedBannerProps {
  children: any
}

function AnimatedBanner(props: AnimatedBannerProps) {
  return (
    <motion.div
      style={{ position: 'fixed', left: '50%', top: '50%', zIndex: 1 }}
      initial={{ y: '-75%', x: '-50%', scale: 0.5, opacity: 0 }}
      animate={{ y: '-50%', x: '-50%', scale: 1, opacity: 1 }}
      exit={{ y: '-50%', x: '-50%', scale: 0.85, opacity: 0 }}
    >
      <Banner>{props.children}</Banner>
    </motion.div>
  )
}
