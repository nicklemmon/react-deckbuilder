import { css } from 'styled-components'

export const formFieldStyles = css`
  appearance: none;
  padding: ${props => props.theme.space[2]};
  border: 1px solid ${props => props.theme.colors.darkGray};
  font-size: ${props => props.theme.fontSizes[2]};
  background: transparent;
  color: currentColor;
  box-shadow: ${props => props.theme.shadows[0]};
  width: 100%;

  &:focus,
  &:hover {
    border-color: ${props => props.theme.colors.gray};
  }
`
