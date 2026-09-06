import type { Meta, StoryObj } from '@storybook/react-vite'
import { HealthBar } from './health-bar'

const meta = {
  component: HealthBar,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: '18rem' }}>
        <Story />
      </div>
    ),
  ],
  args: { health: 75, maxHealth: 100 },
} satisfies Meta<typeof HealthBar>

export default meta
type Story = StoryObj<typeof meta>

export const Healthy: Story = {}

export const Injured: Story = { args: { health: 25 } }

export const Defeated: Story = { args: { health: 0 } }

export const Overhealed: Story = { args: { health: 125 } }
