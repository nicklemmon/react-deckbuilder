import { useMachine } from '@xstate/react'
import { appMachine } from './machines/app-machine/app-machine.ts'
import { AppPreloader } from './components/app-preloader.tsx'
import { CharacterCreation } from './components/character-creation.tsx'
import { Avatar } from './components/avatar.tsx'
import { GameError } from './components/game-error.tsx'
import { Deck } from './components/deck.tsx'
import { Card } from './components/card.tsx'
import { Stack } from './components/stack.tsx'
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
        {context.game.player.characterPortrait ? (
          <Avatar src={context.game.player.characterPortrait} />
        ) : null}

        <div>Monster:</div>
        {context.game.monster?.artwork ? <Avatar src={context.game.monster?.artwork} /> : null}

        {JSON.stringify(context.game.monster?.stats)}

        <Stack>
          <Deck isStacked>
            {context.game.drawPile.map((card, index) => {
              return (
                <Card
                  {...card}
                  deckIndex={index}
                  align="right"
                  key={`draw-pile-card-${card.id}-${index}`}
                  orientation="face-down"
                />
              )
            })}
          </Deck>
          Draw pile
        </Stack>
      </>
    )
  }

  return <GameError />
}
