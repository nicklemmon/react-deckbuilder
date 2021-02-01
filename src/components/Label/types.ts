export enum LabelVariant {
  'dark',
  'light',
}

export interface LabelProps extends React.ComponentPropsWithoutRef<'label'> {
  children: React.ReactNode
  htmlFor?: string
  variant?: LabelVariant
  as?: 'label' | 'legend'
  className?: string
}
