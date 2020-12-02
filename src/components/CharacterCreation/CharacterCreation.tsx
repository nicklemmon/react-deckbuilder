import React, { ChangeEvent, SyntheticEvent } from 'react'
import { useGameMachine } from 'src/GameMachineContext'
import { Button, ButtonVariant } from 'src/components'
import { Label, Field, Form, FormControl, Wrapper } from './CharacterCreationStyles'

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
        <FormControl>
          <Label htmlFor="character-name">Name</Label>
          <Field
            id="character-name"
            type="text"
            name="name"
            autoComplete="off"
            onChange={handleChange}
            value={characterForm.name}
            required
          />
        </FormControl>

        <FormControl>
          <Label htmlFor="character-class">Character Class</Label>
          <Field
            as="select"
            id="character-class"
            name="characterClass"
            value={characterForm.characterClass}
            onChange={handleChange}
          >
            <option value="berzerker">Berzerker</option>
            <option value="cleric">Cleric</option>
            <option value="archer">Archer</option>
          </Field>
        </FormControl>

        <Button variant={ButtonVariant['primary']} type="submit">
          Create Character
        </Button>
      </Form>
    </Wrapper>
  )
}
