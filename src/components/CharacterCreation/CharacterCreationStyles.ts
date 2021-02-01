import styled from 'styled-components'

export const Directions = styled.h1`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes[2]};
  font-family: ${props => props.theme.fonts.body};
  margin-bottom: ${props => props.theme.space[2]};
`

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

export const CardRadioButtons = styled.div`
  display: grid;
  grid-gap: ${props => props.theme.space[3]};
  grid-template-columns: 1fr 1fr 1fr 1fr;
`

export const PortraitImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
