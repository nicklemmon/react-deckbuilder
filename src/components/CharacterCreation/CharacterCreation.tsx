import React, { ChangeEvent, SyntheticEvent } from 'react'
import { useGameMachine } from 'src/GameMachineContext'
import {
  Button,
  ButtonVariant,
  CardRadioButton,
  Label,
  TextInput,
  Select,
  Stack,
} from 'src/components'
import config from 'src/config'
import { CardRadioButtons, Directions, Form, PortraitImg, Wrapper } from './CharacterCreationStyles'

export default function CharacterCreation() {
  const [state, send] = useGameMachine()
  const { context } = state
  const { characterForm } = context
  console.log('characterForm', characterForm)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    return send({
      type: 'FORM_VALUE_CHANGE',
      data: { value: e.target.value, name: e.target.name },
    })
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    return send({ type: 'SUBMIT_FORM', data: { ...characterForm } })
  }

  return (
    <Wrapper>
      <Directions>Create your character.</Directions>

      <Form onSubmit={handleSubmit}>
        <Stack>
          <div>
            <Label htmlFor="character-name">Name</Label>
            <TextInput
              type="text"
              id="character-name"
              name="name"
              autoComplete="off"
              onChange={handleChange}
              value={characterForm.name}
              required
            />
          </div>

          <div>
            <Label htmlFor="character-class">Character Class</Label>
            <Select
              id="character-class"
              name="characterClass"
              value={characterForm.characterClass}
              onChange={handleChange}
            >
              <option value="berzerker">Berzerker</option>
              <option value="cleric">Cleric</option>
              <option value="archer">Archer</option>
            </Select>
          </div>

          <fieldset>
            <Label as="legend">Character Portrait</Label>

            <CardRadioButtons>
              {config.playerPortraits.map((portrait: string, index: number) => {
                return (
                  <CardRadioButton
                    key={`card-radio-button-${index}`}
                    label="Character Portrait"
                    name="artwork"
                    id={`card-radio-button-${index}`}
                    onChange={handleChange}
                    checked={characterForm.artwork === portrait}
                    value={portrait}
                  >
                    <PortraitImg src={portrait} alt="" role="presentation" />
                  </CardRadioButton>
                )
              })}
            </CardRadioButtons>
          </fieldset>

          <Button variant={ButtonVariant['primary']} type="submit">
            Create Character
          </Button>
        </Stack>
      </Form>
    </Wrapper>
  )
}
