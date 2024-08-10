import { type SyntheticEvent } from 'react'
import { useMachine } from '@xstate/react'
import berzerker1Img from '../images/player-portraits/berzerker-1.png'
import berzerker2Img from '../images/player-portraits/berzerker-2.png'
import fallenKingImg from '../images/player-portraits/fallen-king.png'
import giant1Img from '../images/player-portraits/giant-1.png'
import giant2Img from '../images/player-portraits/giant-2.png'
import goldenWarriorImg from '../images/player-portraits/golden-warrior.png'
import mage1Img from '../images/player-portraits/mage-1.png'
import samuraiImg from '../images/player-portraits/samurai.png'
import warrior1Img from '../images/player-portraits/warrior-1.png'
import warrior2Img from '../images/player-portraits/warrior-2.png'
import { appMachine } from '../machines/app-machine/app-machine'
import { Button } from './button'
import css from './character-creation.module.css'

/** Array of available player portraits when creating a character */
const PLAYER_PORTRAITS = [
  berzerker1Img,
  berzerker2Img,
  fallenKingImg,
  giant1Img,
  giant2Img,
  goldenWarriorImg,
  mage1Img,
  samuraiImg,
  warrior1Img,
  warrior2Img,
]

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
      <h1>Create your character</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="character-name">Character name</label>
          <input id="character-name" type="text" name="characterName" autoComplete="off" required />
        </div>

        <div>
          <label htmlFor="character-class">Character class</label>
          <select id="character-class" name="characterClass" required>
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
          <legend>Character portrait</legend>

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
      </form>
    </div>
  )
}
