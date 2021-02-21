import React from 'react'
import { useMachine } from '@xstate/react'
import { ProcessEnv as ProcessEnvInterface } from 'src/interfaces'
import { PlayArea, StateMachineViewer, CharacterCreation } from 'src/components'
import { AppMachine } from 'src/machines/app'
import {
  CharacterCreationEvent,
  CHARACTER_CREATION_MACHINE_ID,
} from 'src/machines/characterCreation'
import { PlayAreaEvent, PLAY_AREA_MACHINE_ID } from 'src/machines/playArea'
import { SpawnedActorRef } from 'xstate'

// eslint-disable-next-line
interface ProcessEnv extends ProcessEnvInterface {}

export default function Game() {
  const [state, _send, service] = useMachine(AppMachine)
  const characterCreationMachine:
    | SpawnedActorRef<CharacterCreationEvent>
    | undefined = service.children.get(CHARACTER_CREATION_MACHINE_ID)
  const gameMachine: SpawnedActorRef<PlayAreaEvent> | undefined = service.children.get(
    PLAY_AREA_MACHINE_ID,
  )
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
