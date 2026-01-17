import { type SyntheticEvent } from 'react'
import { Button } from './button'
import css from './character-creation.module.css'
import { Stack } from './stack'
import type { GameMode } from '../types/global'
import type { CharacterClass } from '../types/character-classes'

/** UI view for character creation */
export function CharacterCreation({
  onCreate,
  gameMode,
  characterClasses,
  playerPortraits,
}: {
  onCreate: (data: Record<string, FormDataEntryValue>) => void
  gameMode: GameMode
  characterClasses: Array<CharacterClass>
  playerPortraits: Array<{ path: string; url: string }>
}) {
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
              {characterClasses.map((characterClass, index) => {
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

            {playerPortraits
              .filter((portrait) => {
                return portrait.path.includes(`.${gameMode}.`)
              })
              .map((portrait, index) => {
                return (
                  <label
                    key={`portrait-ratio-${index}`}
                    className={css['character-portrait-label']}
                  >
                    <input
                      name="characterPortrait"
                      type="radio"
                      value={portrait.url}
                      className={css['character-portrait-input']}
                      defaultChecked={index === 0}
                    />

                    <img src={portrait.url} className={css['character-portrait-img']} />
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
