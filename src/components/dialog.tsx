import { clsx } from 'clsx'
import css from './dialog.module.css'

export function Dialog({ open, children }: { open: boolean; children: React.ReactNode }) {
  const withStatusClsx = (root: string) =>
    clsx({
      [css[root]]: true,
      [css['is-open']]: open === true,
    })

  return (
    <>
      <div role="dialog" className={withStatusClsx('dialog')}>
        {children}
      </div>

      <div className={withStatusClsx('dialog-overlay')} />
    </>
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className={css['dialog-content']}>{children}</div>
}
