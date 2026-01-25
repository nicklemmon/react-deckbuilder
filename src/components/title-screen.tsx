import { Button } from './button'
import { motion } from 'motion/react'
import { Stack } from './stack'
import styles from './title-screen.module.css'
import { Panel, PanelBody } from './panel'

export function TitleScreen({ onStartClick }: { onStartClick: () => void }) {
  return (
    <Stack align="center">
      <motion.div
        initial={{ x: 0, y: -25, opacity: 0.85, scaleX: 0.95 }}
        animate={{ x: 0, y: 0, opacity: 1, scaleX: 1 }}
        transition={{ type: 'spring' }}
      >
        <h1 className={styles['heading']}>React Deckbuilder</h1>
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
