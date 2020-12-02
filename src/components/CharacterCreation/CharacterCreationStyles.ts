import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.darkGray};
  padding: ${props => props.theme.space[3]};
`

export const Form = styled.form`
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.darkGray};
  padding: ${props => props.theme.space[3]};
  width: 100%;
  max-width: 800px;
`

export const FormControl = styled.div`
  display: flex;
  flex-direction: column;

  + * {
    margin-top: ${props => props.theme.space[3]};
  }
`

export const Label = styled.label`
  font-size: ${props => props.theme.fontSizes[1]};
  font-family: ${props => props.theme.fonts.heading};
  color: currentColor;
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: 700;
  margin-bottom: ${props => props.theme.space[2]};
`

export const Field = styled.input`
  appearance: none;
  padding: ${props => props.theme.space[2]};
  border: 1px solid ${props => props.theme.colors.darkGray};
  font-size: ${props => props.theme.fontSizes[2]};
  background: transparent;
  color: currentColor;
  box-shadow: ${props => props.theme.shadows[0]};

  &:focus,
  &:hover {
    border-color: ${props => props.theme.colors.gray};
  }
`
