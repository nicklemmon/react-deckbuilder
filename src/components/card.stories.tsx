import type { Meta, StoryObj } from '@storybook/react-vite'
import { CARDS, requireCard } from '../helpers/cards'
import { Card } from './card'

const firebolt = requireCard('firebolt', CARDS)

const meta = {
  component: Card,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  render: (args, context) => {
    const globals = context.globals as Record<string, unknown>
    const gameMode = globals['gameMode'] === 'rainbow' ? 'rainbow' : 'standard'

    return <Card {...args} mode={gameMode} />
  },
  args: {
    id: firebolt.id,
    name: firebolt.name,
    rarity: firebolt.rarity,
    description: firebolt.description,
    stats: firebolt.stats,
    ...(firebolt.artwork ? { artwork: firebolt.artwork } : {}),
    finishAnimated: true,
    orientation: 'face-up',
    status: 'idle',
  },
  argTypes: {
    finish: {
      control: 'select',
      options: ['none', 'foil', 'prismatic', 'gold', 'ember'],
    },
    finishIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    orientation: { control: 'inline-radio', options: ['face-up', 'face-down'] },
    status: { control: 'inline-radio', options: ['idle', 'disabled', 'in-play'] },
    mode: { table: { disable: true } },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { finish: 'none' } }

export const EtchedFoil: Story = { args: { finish: 'foil' } }

export const Prismatic: Story = { args: { finish: 'prismatic' } }

export const Gilded: Story = { args: { finish: 'gold' } }

export const Ember: Story = { args: { finish: 'ember' } }

export const CustomStrength: Story = {
  args: { finish: 'prismatic', finishIntensity: 0.25 },
}

export const FaceDown: Story = { args: { orientation: 'face-down' } }

export const Disabled: Story = { args: { status: 'disabled' } }
