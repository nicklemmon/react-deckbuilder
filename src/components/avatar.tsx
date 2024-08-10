import css from './avatar.module.css'

/** Displays the current player character portrait */
export function Avatar({ src }: { src: string }) {
  return <img className={css['avatar-img']} src={src} />
}
