import { SyntheticEvent } from 'react'
import { SpawnedActorRef } from 'xstate'
import { useActor, useSelector } from '@xstate/react'
import config from '../../config'
import {
  Button,
  ButtonVariant,
  CardRadioButton,
  Label,
  Legend,
  TextInput,
  Select,
  Stack,
} from '../../components'
import { CharacterCreationEvent } from '../../machines/characterCreation'
import { CardRadioButtons, Directions, Form, PortraitImg, Wrapper } from './styles'

interface CharacterCreationProps {
  machine: SpawnedActorRef<CharacterCreationEvent>
}

export function CharacterCreation({ machine }: CharacterCreationProps) {
  const [state, send] = useSelector(machine)
  const { context } = state
  const { name, characterClass, characterPortrait } = context

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    return send({ type: 'SUBMIT_FORM' })
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
              onChange={(e) => send({ type: 'NAME_CHANGE', name: e.target.value })}
              value={name}
              required
            />
          </div>

          <div>
            <Label htmlFor="character-class">Character Class</Label>
            <Select
              id="character-class"
              name="characterClass"
              value={characterClass}
              onChange={(e) => {
                const { value } = e.target

                send({
                  type: 'CHARACTER_CLASS_CHANGE',
                  // TODO: To handle an enum here?
                  characterClass: value,
                })
              }}
            >
              <option value="berzerker">Berzerker</option>
              <option value="cleric">Cleric</option>
              <option value="archer">Archer</option>
            </Select>
          </div>

          <fieldset>
            <Legend>Character Portrait</Legend>

            <CardRadioButtons>
              {config.playerPortraits.map((portrait: string, index: number) => {
                return (
                  <CardRadioButton
                    key={`card-radio-button-${index}`}
                    label="Character Portrait"
                    name="artwork"
                    id={`card-radio-button-${index}`}
                    onChange={(e) =>
                      send({ type: 'CHARACTER_PORTRAIT_CHANGE', characterPortrait: e.target.value })
                    }
                    checked={characterPortrait === portrait}
                    value={portrait}
                  >
                    <PortraitImg
                      className="dagger-cursor-override"
                      src={portrait}
                      alt=""
                      role="presentation"
                    />
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
