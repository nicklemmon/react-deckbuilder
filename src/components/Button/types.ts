export enum ButtonVariant {
  'primary',
  'secondary',
}

export interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant: ButtonVariant
}
