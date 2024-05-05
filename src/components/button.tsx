import { css } from '../../styled-system/css'

/** Props fot eh re-usable button component */
type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'unstyled'
} & React.ComponentPropsWithRef<'button'>

/** Re-usable button component */
export function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={css({
        display: 'inline-flex',
        paddingX: '6',
        paddingY: '3',
        border: '1px solid ActiveBorder',
      })}
      {...props}
    >
      <span>{children}</span>
    </button>
  )
}
