import { Button } from './button'
import { motion } from 'motion/react'
import { Stack } from './stack'
import styles from './title-screen.module.css'
import { Panel, PanelBody } from './panel'
import { useState } from 'react'

export function TitleScreen({ onStartClick }: { onStartClick: () => void }) {
  const [showGlint, setShowGlint] = useState(false)

  return (
    <Stack align="center">
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          damping: 12,
          stiffness: 100,
          mass: 0.8,
          duration: 0.8,
        }}
        onAnimationComplete={() => {
          setTimeout(() => {
            setShowGlint(true)
            setTimeout(() => setShowGlint(false), 1000)
          }, 200)
        }}
      >
        <h1 className={`${styles['heading']} ${showGlint ? styles['glint-active'] : ''}`}>
          React Deckbuilder
        </h1>
      </motion.div>

      <Panel>
        <PanelBody>
          <Stack align="center">
            <p>A deck-building card game built with React and XState</p>

            <Button onClick={onStartClick}>Click to start</Button>
          </Stack>
        </PanelBody>
      </Panel>
    </Stack>
  )
}
