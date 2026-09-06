import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Button } from './button'

const meta = {
  component: Button,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    children: 'Play card',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'unstyled'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Play card' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Tertiary: Story = { args: { variant: 'tertiary' } }

export const Destructive: Story = { args: { children: 'Destroy card', variant: 'destructive' } }

export const Disabled: Story = { args: { disabled: true } }
