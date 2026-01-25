import { Stack } from './stack'

export function TitleScreen({ onStartClick }: { onStartClick: () => void }) {
  return (
    <Stack>
      <h1>React Deckbuilder</h1>

      <button onClick={onStartClick}>Click to start</button>
    </Stack>
  )
}
