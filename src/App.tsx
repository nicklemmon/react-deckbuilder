import { useMachine } from '@xstate/react'
import { appMachine } from './machines/app-machine/app-machine.ts'
import { AppPreloader } from './components/app-preloader.tsx'
import { CharacterCreation } from './components/character-creation.tsx'
import { Game } from './components/game.tsx'
import { GameError } from './components/game-error.tsx'
import './index.css'

export function App() {
  const [{ context, value }, send] = useMachine(appMachine)

  if (value === 'LoadingAssets') {
    return <AppPreloader />
  }

  if (value === 'CharacterCreation') {
    return (
      <CharacterCreation
        onCreate={(formData) => send({ type: 'CREATE_CHARACTER', data: formData })}
      />
    )
  }

  if (value === 'PlayingGame') {
    return (
      <>
        <div>Character name: {context.game.player.characterName}</div>
        <div>Character class: {context.game.player.characterClass?.name}</div>
        <img src={context.game.player.characterPortrait} />

        <div>Monster:</div>
        <img src={context.game.monster?.artwork} />
      </>
    )
  }

  return <GameError />
}
