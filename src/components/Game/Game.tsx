import React from 'react'
import ProcessEnvInterface from 'src/interfaces/ProcessEnv'
import { useGameMachine } from 'src/GameMachineContext'
import { PlayArea } from 'src/components/PlayArea'
import { StateMachineViewer } from 'src/components/StateMachineViewer'
import { CharacterCreation } from 'src/components/CharacterCreation'

// eslint-disable-next-line
interface ProcessEnv extends ProcessEnvInterface {}

export default function Game() {
  const [state] = useGameMachine()

  return (
    <>
      {state.matches('playerCreation') ? <CharacterCreation /> : <PlayArea />}

      {process.env['NODE_ENV'] !== 'production' ? <StateMachineViewer /> : null}
    </>
  )
}
