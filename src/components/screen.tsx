import { clsx } from 'clsx'
import styles from './screen.module.css'

/**
 * Standard screen/view wrapper component that provides consistent layout and spacing
 * across different game screens.
 */
export function Screen({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ComponentPropsWithRef<'div'>) {
  return (
    <div className={clsx(styles.screen, className)} {...props}>
      {children}
    </div>
  )
}
