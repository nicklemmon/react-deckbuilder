import { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './screen.module.css'

type ScreenProps = {
  children: ReactNode
  className?: string
}

/**
 * Standard screen/view wrapper component that provides consistent layout and spacing
 * across different game screens.
 */
export const Screen = ({ children, className }: ScreenProps) => {
  return <div className={clsx(styles.screen, className)}>{children}</div>
}
