import { type SyntheticEvent } from 'react'
import { useMachine } from '@xstate/react'
import { appMachine } from '../machines/app-machine/app-machine'
import { Button } from './button'
import css from './character-creation.module.css'
import { resolveModules } from '../helpers/vite'
import { Stack } from './stack'

const PLAYER_PORTRAIT_MODULES = import.meta.glob('../images/player-portraits/*.(png|webp)', {
  eager: true,
})

const PLAYER_PORTRAITS = resolveModules<string>(PLAYER_PORTRAIT_MODULES)

/** UI view for character creation */
export function CharacterCreation({
  onCreate,
}: {
  onCreate: (data: Record<string, FormDataEntryValue>) => void
}) {
  const [{ context }] = useMachine(appMachine)

  /** Handler for the form submit event */
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const json = Object.fromEntries(formData)

    onCreate(json)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={css['form']}>
        <Stack>
          <h1>Create your character</h1>

          <div className={css['input-ctrl']}>
            <label htmlFor="character-name" className={css['input-label']}>
              Character name
            </label>
            <input
              className={css['input']}
              defaultValue="Nick"
              id="character-name"
              type="text"
              name="characterName"
              autoComplete="off"
              required
            />
          </div>

          <div className={css['input-ctrl']} hidden>
            <label htmlFor="character-class" className={css['input-label']}>
              Character class
            </label>

            <select id="character-class" name="characterClass" required className={css['input']}>
              {context.assets.characterClasses.map((characterClass, index) => {
                return (
                  <option key={`${characterClass.id}${index}`} value={characterClass.id}>
                    {characterClass.name}
                  </option>
                )
              })}
            </select>
          </div>

          <fieldset className={css['character-portrait-fieldset']}>
            <legend className={css['input-label']}>Character portrait</legend>

            {PLAYER_PORTRAITS.map((portrait, index) => {
              return (
                <label key={`portrait-ratio-${index}`} className={css['character-portrait-label']}>
                  <input
                    name="characterPortrait"
                    type="radio"
                    value={portrait}
                    className={css['character-portrait-input']}
                    defaultChecked={index === 0}
                  />

                  <img src={portrait} className={css['character-portrait-img']} />
                </label>
              )
            })}
          </fieldset>

          <Button type="submit">Create character</Button>
        </Stack>
      </form>
    </div>
  )
}
