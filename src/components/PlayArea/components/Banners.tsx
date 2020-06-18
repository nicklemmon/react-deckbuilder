import React from 'react'
import { motion } from 'framer-motion'
import { useGameMachine } from 'src/GameMachineContext'
import { Button } from 'src/components/Button'
import { Banner } from 'src/components/Banner'

export function VictoryBanner() {
  // eslint-disable-next-line
  const [state, send] = useGameMachine()

  return (
    <AnimatedBanner>
      Victory!
      <Button
        style={{ marginLeft: '1rem' }}
        variant="secondary"
        onClick={() => send('ITEM_SHOP_CLICK')}
      >
        Item Shop
      </Button>
      <Button
        style={{ marginLeft: '1rem' }}
        variant="primary"
        onClick={() => send('NEXT_BATTLE_CLICK')}
      >
        Next Battle
      </Button>
    </AnimatedBanner>
  )
}

export function DefeatBanner() {
  return <AnimatedBanner>Defeat!</AnimatedBanner>
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
