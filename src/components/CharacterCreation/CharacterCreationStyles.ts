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