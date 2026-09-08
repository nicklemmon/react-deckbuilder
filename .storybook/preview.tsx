import type { Preview } from '@storybook/react-vite'
import '../src/global.css'

const preview: Preview = {
  globalTypes: {
    gameMode: {
      description: 'Game mode used by components',
      toolbar: {
        title: 'Game mode',
        icon: 'paintbrush',
        items: [
          { value: 'standard', title: 'Standard' },
          { value: 'rainbow', title: 'Rainbow' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    gameMode: 'standard',
  },
  decorators: [
    (Story, context) => {
      const globals = context.globals as Record<string, unknown>
      const gameMode = globals['gameMode'] === 'rainbow' ? 'rainbow' : 'standard'

      return (
        <div data-game-mode={gameMode} style={{ display: 'contents' }}>
          <Story />
        </div>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
