import { useMachine } from '@xstate/react'
import { appMachine } from './machines/app-machine/app-machine.ts'
import { AppPreloader } from './components/app-preloader.tsx'
import { CharacterCreation } from './components/character-creation.tsx'
import { Game } from './components/game.tsx'
import { GameError } from './components/game-error.tsx'

export function App() {
  const [snapshot, send] = useMachine(appMachine)

  if (snapshot.value === 'LoadingAssets') {
    return <AppPreloader />
  }

  if (snapshot.value === 'CharacterCreation') {
    return (
      <CharacterCreation
        onCreate={(formData) => send({ type: 'CREATE_CHARACTER', data: formData })}
      />
    )
  }

  if (snapshot.value === 'PlayingGame') {
    return (
      <>
        <div>Character name: {snapshot.context.game.player.characterName}</div>
        <div>Character class: {snapshot.context.game.player.characterClass?.name}</div>
        <img src={snapshot.context.game.player.characterPortrait} />
        <Game />
      </>
    )
  }

  return <GameError />
}
