export enum LabelVariant {
  'dark',
  'light',
}

export interface LabelProps extends React.ComponentPropsWithoutRef<'label'> {
  children: React.ReactNode
  htmlFor: string
  variant?: LabelVariant
  className?: string
}
