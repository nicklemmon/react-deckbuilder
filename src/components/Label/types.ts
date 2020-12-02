export enum LabelVariant {
  'dark',
  'light',
}

export interface LabelProps extends React.ComponentPropsWithoutRef<'label'> {
  htmlFor: string
  variant?: LabelVariant
}
