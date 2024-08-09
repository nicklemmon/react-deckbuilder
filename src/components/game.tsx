import { useMachine } from '@xstate/react'
import { gameMachine } from '../machines/game-machine/game-machine'

export function Game() {
  const [{ context, status }] = useMachine(gameMachine)

  console.log('status', status)
  console.log('context', context)

  return (
    <div>
      <h1>Game component:</h1>
      Monster:
      <img src={context.monster.artwork} />
      {}
    </div>
  )
}
