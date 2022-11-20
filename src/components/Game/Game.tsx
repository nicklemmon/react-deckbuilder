import React from 'react'
import { useMachine } from '@xstate/react'
import { ProcessEnv as ProcessEnvInterface } from '../../interfaces'
import { PlayArea, StateMachineViewer, CharacterCreation } from '../../components'
import { AppMachine } from '../../machines/app'
import {
  CharacterCreationEvent,
  CHARACTER_CREATION_MACHINE_ID,
} from '../../machines/characterCreation'
import { PlayAreaEvent, PLAY_AREA_MACHINE_ID } from '../../machines/playArea'
import { SpawnedActorRef } from 'xstate'

// eslint-disable-next-line
interface ProcessEnv extends ProcessEnvInterface {}

export default function Game() {
  // eslint-disable-next-line
  const [state, _send, service] = useMachine(AppMachine)
  const characterCreationMachine: SpawnedActorRef<CharacterCreationEvent> | undefined =
    service.children.get(CHARACTER_CREATION_MACHINE_ID)
  const gameMachine: SpawnedActorRef<PlayAreaEvent> | undefined =
    service.children.get(PLAY_AREA_MACHINE_ID)
  const isProduction: boolean = import.meta.env.PROD === true

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
