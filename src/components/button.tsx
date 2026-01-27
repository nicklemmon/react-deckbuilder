import { clsx } from 'clsx'
import css from './button.module.css'

/** Re-usable button component */
export function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'unstyled'
} & React.ComponentPropsWithRef<'button'>) {
  const withClsx = (root: string, className?: string) => {
    return clsx(
      {
        [css[root]]: true,
        [css[variant]]: true,
      },
      className,
    )
  }

  return (
    <button className={withClsx('button', className)} {...props}>
      <span className={withClsx('button-content')}>{children}</span>
      <span className={withClsx('button-bg')} />
    </button>
  )
}
