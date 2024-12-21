import css from './banner.module.css'

export function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className={css['banner']}>
      <div className={css['banner-content']}>{children}</div>
    </div>
  )
}
