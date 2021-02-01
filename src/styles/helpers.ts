import { css } from 'styled-components'

export const formFieldStyles = css`
  appearance: none;
  padding: ${props => props.theme.space[3]};
  border: 1px solid ${props => props.theme.colors.gray};
  font-size: ${props => props.theme.fontSizes[2]};
  background: rgba(0, 0, 0, 0.25);
  color: currentColor;
  width: 100%;
  transition: ${props => `box-shadow ${props.theme.duration[0]} ease-in-out`};

  &:focus,
  &:hover {
    border-color: ${props => props.theme.colors.gray};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.gray};
  }
`

export const screenReaderOnly = css`
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  word-wrap: normal !important;
`

export const labelStyles = css`
  display: block;
  font-size: ${props => props.theme.fontSizes[1]};
  font-family: ${props => props.theme.fonts.heading};
  color: currentColor;
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: 700;
  margin-bottom: ${props => props.theme.space[2]};
`
