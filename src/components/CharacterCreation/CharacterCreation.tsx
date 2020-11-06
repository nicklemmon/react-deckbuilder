import React, { ChangeEvent, SyntheticEvent } from 'react'
import { useGameMachine } from 'src/GameMachineContext'

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
    <div>
      <p>Create your character.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="character-name">Name</label>
          <input
            id="character-name"
            type="text"
            name="name"
            onChange={handleChange}
            value={characterForm.name}
            required
          />
        </div>

        <div>
          <label htmlFor="character-class">Character Class</label>
          <select
            id="character-class"
            name="characterClass"
            value={characterForm.characterClass}
            onChange={handleChange}
          >
            <option value="berzerker">Berzerker</option>
            <option value="cleric">Cleric</option>
            <option value="archer">Archer</option>
          </select>
        </div>

        <button type="submit">Save Character</button>
      </form>
    </div>
  )
}
