import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Deck } from 'src/components/Deck'
import { AttackStat, DefenseStat, GoldStat, Stats } from 'src/components/Stats'
import { StatusBar } from 'src/components/StatusBar'
import { Card } from 'src/components/Card'
import { Monster } from 'src/components/Monster'
import { Player } from 'src/components/Player'
import { StateMachineViewer } from 'src/components/StateMachineViewer'
import CardInterface from 'src/interfaces/Card'
import {
  BattleWrapper,
  CardInPlayWrapper,
  CurrentHandWrapper,
  DiscardPileWrapper,
  DrawPileWrapper,
  PlayAreaWrapper,
} from './PlayAreaStyles'
import ProcessEnvInterface from 'src/interfaces/ProcessEnv'
import player from 'src/config/player'
import { useGameMachine } from 'src/GameMachineContext'
import ShoppingModal from './components/ShoppingModal'
import { VictoryBanner, DefeatBanner } from './components/Banners'
import DrawPile from './components/DrawPile'
import DiscardPile from './components/DiscardPile'
import CardInPlay from './components/CardInPlay'

interface PlayAreaProps {
  children?: any
}

interface ProcessEnv extends ProcessEnvInterface {}

export default function PlayArea(props: PlayAreaProps) {
  const [state, send] = useGameMachine()
  const { context } = state
  const inventory: any = context.player.inventory
  const cardInPlay: any = context.cardInPlay
  const monster: any = context.monster

  console.log(process.env['NODE_ENV'])

  return (
    <PlayAreaWrapper>
      {process.env['NODE_ENV'] !== 'production' ? <StateMachineViewer /> : null}

      <StatusBar>
        <Stats>
          <Stats.Row>
            <GoldStat>{inventory.gold}</GoldStat>

            <AttackStat>{player.stats.attack}</AttackStat>

            <DefenseStat>{player.stats.defense}</DefenseStat>
          </Stats.Row>
        </Stats>
      </StatusBar>

      {state.value === 'shopping' && <ShoppingModal />}

      <AnimatePresence>{state.value === 'victory' && <VictoryBanner />}</AnimatePresence>

      <AnimatePresence>{state.value === 'defeat' && <DefeatBanner />}</AnimatePresence>

      <DrawPileWrapper>
        <DrawPile />
      </DrawPileWrapper>

      <CurrentHandWrapper>
        {context.currentHand && (
          <Deck isStacked={false}>
            {context.currentHand.map((card: CardInterface, index: number) => (
              <Card
                cardIndex={index}
                key={`current-hand-card-${index}`}
                onClick={() => send({ type: 'CHOOSE_CARD', data: { card } })}
                isDisabled={state.value !== 'choosing'}
                {...card}
              />
            ))}
          </Deck>
        )}
      </CurrentHandWrapper>

      <CardInPlayWrapper>
        <AnimatePresence>{cardInPlay && <CardInPlay />}</AnimatePresence>
      </CardInPlayWrapper>

      <BattleWrapper>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0 }}
        >
          <Player
            isTakingDamage={state.value === 'defending'}
            damageTaken={state.value === 'defending' ? context.player.damageTaken : null}
            name={context.player.name}
            level={context.player.level}
            stats={context.player.stats}
            artwork={context.player.artwork}
            inventory={inventory}
          />
        </motion.div>

        <AnimatePresence>
          {monster && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 0, y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <Monster
                isTakingDamage={state.value === 'attacking'}
                damageTaken={state.value === 'attacking' ? monster.damageTaken : null}
                id={monster.id}
                name={monster.name}
                level={monster.level}
                stats={monster.stats}
                artwork={monster.artwork}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </BattleWrapper>

      <DiscardPileWrapper>
        <DiscardPile />
      </DiscardPileWrapper>
    </PlayAreaWrapper>
  )
}
