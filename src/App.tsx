import { useMachine } from '@xstate/react'
// import { AssetPreloader } from './components/asset-preloader.tsx'
import { appMachine } from './machines/app.machine.ts'
import { AppPreloader } from './components/app-preloader.tsx'
import { CharacterCreation } from './components/character-creation.tsx'
import { Game } from './components/game.tsx'

export function App() {
  const [snapshot, send] = useMachine(appMachine)

  if (snapshot.value === 'LoadingAssets') return <AppPreloader />

  if (snapshot.value === 'CharacterCreation') return <CharacterCreation />

  if (snapshot.value === 'Game') return <Game />

  return <GameError />
}
