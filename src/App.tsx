import { useMachine } from '@xstate/react'
// import { AssetPreloader } from './components/asset-preloader.tsx'
import { appMachine } from './machines/app.machine.ts'
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
      <CharacterCreation onCreate={(formData) => send({ type: 'CREATE_CHARACTER', ...formData })} />
    )
  }

  if (snapshot.value === 'PlayingGame') {
    console.log('snapshot', snapshot)
    return (
      <>
        <div>Character name: {snapshot.context.player.characterName}</div>
        <div>Character class: {snapshot.context.player.characterClass}</div>
        <img src={snapshot.context.player.characterPortrait} />
        <Game />
      </>
    )
  }

  return <GameError />
}
