export enum TextInputVariant {
  'dark',
  'light',
}

export interface TextInputProps extends React.ComponentPropsWithRef<'input'> {
  id: string
  variant?: TextInputVariant
}
