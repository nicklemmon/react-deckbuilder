export interface CardRadioButtonProps extends React.ComponentPropsWithRef<'input'> {
  id: string
  checked: boolean
  label: string | React.ReactNode
  value: string
  children?: React.ReactNode
  name?: string
}
