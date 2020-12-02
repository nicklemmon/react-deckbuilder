import React, { ChangeEvent, SyntheticEvent } from 'react'
import { useGameMachine } from 'src/GameMachineContext'
import { Button, ButtonVariant, Label, TextInput, Select, Stack } from 'src/components'
import { Form, Wrapper } from './CharacterCreationStyles'

export default function CharacterCreation() {
  const [state, send] = useGameMachine()
  const { context } = state
  const { characterForm } = context

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    return send({
      type: 'FORM_VALUE_CHANGE',
      data: { value: e.target.value, name: e.target.name },
    })
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    return send({ type: 'SUBMIT_FORM', data: { ...characterForm } })
  }

  return (
    <Wrapper>
      <p>Create your character.</p>

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

          <Button variant={ButtonVariant['primary']} type="submit">
            Create Character
          </Button>
        </Stack>
      </Form>
    </Wrapper>
  )
}
