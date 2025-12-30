import { clsx } from 'clsx'
import styles from './panel.module.css'

export function Panel({
  className,
  children,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ComponentPropsWithRef<'div'>) {
  return (
    <div className={clsx(styles['panel'], className)} {...props}>
      {children}
    </div>
  )
}

export function PanelBody({
  className,
  children,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ComponentPropsWithRef<'div'>) {
  return (
    <div className={clsx(styles['panel-body'], className)} {...props}>
      {children}
    </div>
  )
}
