import styled from 'styled-components'
import { screenReaderOnly } from 'src/styles/helpers'
import { CardRadioButtonProps } from './types'

const Wrapper = styled.div<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space[2]};
  border-radius: ${props => props.theme.radii[1]};
  background-color: ${props => props.theme.colors.white};
  object-fit: cover;
  border: 3px solid;
  border-color: ${props => (props.checked ? props.theme.colors.green : 'transparent')};
  transition-duration: ${props => props.theme.duration[1]};
  transition-timing-function: ease-in-out;
  transition-property: box-shadow, border-color, transform;

  &:focus-within {
    box-shadow: 0 0 0 3px ${props => props.theme.colors.gray};
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.25);
  }
`

const Label = styled.label`
  color: pink;
  display: flex;
`

const LabelContent = styled.span`
  ${screenReaderOnly}
`

const Input = styled.input`
  position: fixed;
  opacity: 0;
  pointer-events: none;
`

export function CardRadioButton(props: CardRadioButtonProps) {
  const { id, name, label, children, checked = false, value, onChange } = props

  return (
    <Wrapper checked={checked}>
      <Label htmlFor={id}>
        <LabelContent>{label}</LabelContent>

        <div aria-hidden="true">{children}</div>

        <Input
          type="radio"
          name={name}
          id={id}
          onChange={onChange}
          checked={checked}
          value={value}
        />
      </Label>
    </Wrapper>
  )
}
