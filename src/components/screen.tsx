import { clsx } from 'clsx'
import styles from './screen.module.css'
import { VolumeControl } from './volume-control.tsx'

/**
 * Standard screen/view wrapper component that provides consistent layout and spacing
 * across different game screens.
 */
export function Screen({
  children,
  className,
  backgroundImage,
  ...props
}: {
  children: React.ReactNode
  className?: string
  backgroundImage?: string
} & React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={clsx(styles.screen, backgroundImage && styles['has-background'], className)}
      style={
        backgroundImage
          ? ({ '--screen-bg-image': `url(${backgroundImage})` } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      <VolumeControl />
      {children}
    </div>
  )
}
