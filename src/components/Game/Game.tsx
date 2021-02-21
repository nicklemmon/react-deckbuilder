import React from 'react'
import { useMachine } from '@xstate/react'
import { ProcessEnv as ProcessEnvInterface } from 'src/interfaces'
import { PlayArea, StateMachineViewer, CharacterCreation } from 'src/components'
import {
  AppMachine,
  CharacterCreationEvent,
  CHARACTER_CREATION_MACHINE_ID,
  GameEvent,
  GAME_MACHINE_ID,
} from 'src/machines'
import { SpawnedActorRef } from 'xstate'

// eslint-disable-next-line
interface ProcessEnv extends ProcessEnvInterface {}

export default function Game() {
  const [state, send, service] = useMachine(AppMachine)
  const characterCreationMachine:
    | SpawnedActorRef<CharacterCreationEvent>
    | undefined = service.children.get(CHARACTER_CREATION_MACHINE_ID)
  const gameMachine: SpawnedActorRef<GameEvent> | undefined = service.children.get(GAME_MACHINE_ID)
  const isProduction: boolean = process.env['NODE_ENV'] !== 'production'

  return (
    <>
      {characterCreationMachine && state.matches('creatingCharacter') && (
        <CharacterCreation machine={characterCreationMachine} />
      )}

      {gameMachine && state.matches('playing') && <PlayArea machine={gameMachine} />}

      {!isProduction && <StateMachineViewer state={state} />}
    </>
  )
}
