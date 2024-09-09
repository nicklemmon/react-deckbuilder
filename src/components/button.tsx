import { clsx } from 'clsx'
import css from './button.module.css'

/** Re-usable button component */
export function Button({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'unstyled'
} & React.ComponentPropsWithRef<'button'>) {
  const withClsx = (root: string) =>
    clsx({
      [css[root]]: true,
      [css[variant]]: true,
    })

  return (
    <button className={withClsx('button')} {...props}>
      <span>{children}</span>
    </button>
  )
}
