export enum LegendVariant {
  'dark',
  'light',
}

export interface LegendProps extends React.ComponentPropsWithoutRef<'legend'> {
  children: React.ReactNode
  variant?: LegendVariant
  className?: string
}
