export enum SelectVariant {
  'light',
  'dark',
}

export interface SelectProps extends React.ComponentPropsWithRef<'select'> {
  id: string
  variant?: SelectVariant
}
