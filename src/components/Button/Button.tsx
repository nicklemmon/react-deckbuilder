import React from 'react'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'
import { getSound } from '../../functions'
import ButtonClickSfx from '../../sounds/ui.button-click.wav'
import { ButtonProps, ButtonVariant } from './types'

const clickSound = getSound({ src: ButtonClickSfx, volume: 0.33 })

const StyledButtonOverlay = styled('div')<{ variant: ButtonVariant }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${(props) => props.theme.zIndices[1]};
  width: 100%;
  height: 125%;
  transform: translateY(40%);
  transform-origin: bottom;
  transition-property: transform;
  transition-delay: ${(props) => props.theme.duration[0]};
  transition-duration: ${(props) => props.theme.duration[0]};
  transition-timing-function: ease-in-out;

  ${(props) => {
    switch (props.variant) {
      case ButtonVariant['primary']:
        return {
          'background-color': transparentize(0.85, props.theme.colors.darkPink),
        }
      case ButtonVariant['secondary']:
        return {
          'background-color': transparentize(0.9, props.theme.colors.lightPink),
        }
      default:
        return
    }
  }}
`

const hoverActiveStyles = css`
  transform: translateY(-1px);
  filter: ${(props) => `drop-shadow(0 0 0.75rem ${props.theme.colors.darkGray})`};

  ${StyledButtonOverlay} {
    transform: translateY(0);
  }
`

const StyledButton = styled('button')<{ variant: ButtonVariant; fullWidth: boolean }>`
  position: relative; /* allows absolute positioning within */
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  padding: ${(props) => props.theme.space[2]} ${(props) => props.theme.space[3]};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: ${(props) => props.theme.fontSizes[2]};
  border: 0;
  border-radius: ${(props) => props.theme.radii[0]};
  overflow: hidden;
  transition-property: box-shadow, transform, filter;
  transition-duration: ${(props) => props.theme.duration[0]};
  transition-timing-function: ease-in-out;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'unset')};
  filter: ${(props) => (props.disabled ? 'grayscale(100%)' : 'unset')};

  ${(props) => {
    const getBoxShadow = (color: string) =>
      `0 ${props.theme.space[1]} 0 ${color}, 0 ${props.theme.space[1]} ${
        props.theme.space[2]
      } ${transparentize(0.75, props.theme.colors.darkGray)}`

    switch (props.variant) {
      case ButtonVariant['primary']:
        return {
          'background-color': props.theme.colors.pink,
          color: props.theme.colors.white,
          'box-shadow': getBoxShadow(props.theme.colors.darkPink),
        }
      case ButtonVariant['secondary']:
        return {
          'background-color': props.theme.colors.white,
          color: props.theme.colors.pink,
          'box-shadow': getBoxShadow(props.theme.colors.pink),
        }
      default:
        return
    }
  }}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px currentColor;
  }

  &:active,
  &:hover {
    ${(props) => (props.disabled ? undefined : hoverActiveStyles)}
  }
`

const StyledButtonContent = styled('div')`
  position: relative;
  z-index: ${(props) => props.theme.zIndices[2]};
`

export default function Button(props: ButtonProps) {
  const {
    variant,
    style,
    onClick,
    children,
    disabled,
    type = 'button',
    fullWidth = false,
    ...rest
  } = props

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    clickSound.play()

    if (onClick) return onClick(event)
  }

  return (
    <StyledButton
      fullWidth={fullWidth}
      style={style}
      variant={variant}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      <StyledButtonContent>{children}</StyledButtonContent>

      <StyledButtonOverlay variant={variant} />
    </StyledButton>
  )
}
