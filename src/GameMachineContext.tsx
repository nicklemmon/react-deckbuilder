import React from 'react'
import { useMachine } from '@xstate/react'
import GameMachine from 'src/GameMachine'

// See: https://kentcdodds.com/blog/how-to-use-react-context-effectively

interface GameMachineProviderProps {
  children: any
}

const GameStateContext = React.createContext<any>(undefined)
const GameSendContext = React.createContext<any>(undefined)

export default function GameMachineProvider(props: GameMachineProviderProps) {
  const [state, send] = useMachine(GameMachine)
  const { children } = props

  return (
    <GameStateContext.Provider value={state}>
      <GameSendContext.Provider value={send}>{children}</GameSendContext.Provider>
    </GameStateContext.Provider>
  )
}

export function useGameMachine() {
  return [useGameState(), useGameSend()]
}

function useGameState() {
  const context = React.useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameMachineProvider')
  }
  return context
}
function useGameSend() {
  const context = React.useContext(GameSendContext)
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameMachineProvider')
  }
  return context
}
