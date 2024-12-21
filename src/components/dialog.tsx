import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import css from './dialog.module.css'

export function Dialog({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
  onClose?: () => void
}) {
  const withStatusClsx = (root: string) =>
    clsx({
      [css[root]]: true,
      [css['is-open']]: open === true,
    })

  return (
    <>
      <div className={withStatusClsx('dialog-container')}>
        <AnimatePresence>
          {open ? (
            <motion.div
              role="dialog"
              key="dialog"
              className={withStatusClsx('dialog')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { delay: 0 } }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="dialog-overlay"
            className={withStatusClsx('dialog-overlay')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className={css['dialog-content']}>{children}</div>
}
