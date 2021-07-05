import React from 'react'
import { motion } from 'framer-motion'
import { transparentize, darken } from 'polished'
import styled, { css } from 'styled-components'
import { ModalProps, ModalContentProps } from './types'

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${props => props.theme.zIndices[4]};
  background-color: ${props => transparentize(0.4, props.theme.colors.darkGray)};
`

const ModalWrapper = styled(motion.div)`
  z-index: ${props => props.theme.zIndices[5]};
  width: 100%;
  max-width: 900px;
  border-radius: ${props => props.theme.radii[2]};
  color: ${props => props.theme.colors.white};
  background: ${props =>
    `linear-gradient(0deg, ${darken(0.075, props.theme.colors.darkGray)}, ${
      props.theme.colors.darkGray
    })`};
  border: 1px solid ${props => props.theme.colors.gray};
  box-shadow: ${props =>
    `0 ${props.theme.space[3]} ${props.theme.space[5]} -${props.theme.space[3]} ${props.theme.colors.coral}`};
`

const Header = styled.div`
  width: 100%;
  padding: ${props => props.theme.space[4]};
`

// TODO: See https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
const getScrollableOverlayStyles = (orientation: 'right' | 'left') => {
  return css`
    content: '';
    position: absolute;
    right: ${() => (orientation === 'right' ? 0 : 'unset')};
    left: ${() => (orientation === 'left' ? 0 : 'unset')};
    top: 0;
    height: 100%;
    width: 15%;
    background: ${props =>
      orientation === 'right'
        ? `linear-gradient(90deg, transparent, ${transparentize(
            0.05,
            props.theme.colors.darkGray,
          )})`
        : `linear-gradient(90deg, ${transparentize(
            0.05,
            props.theme.colors.darkGray,
          )}, transparent)`};
    z-index: ${props => props.theme.zIndices[4]};
  `
}

const ContentWrapper = styled.div<{ scrollable?: boolean }>`
  position: relative;
  width: 100%;
  padding: ${props => props.theme.space[4]};
  overflow-x: ${props => (props.scrollable ? 'scroll' : 'unset')};

  &:after {
    ${props => (props.scrollable ? getScrollableOverlayStyles('right') : undefined)}
  }

  &:before {
    ${props => (props.scrollable ? getScrollableOverlayStyles('left') : undefined)}
  }
`

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${props => props.theme.space[4]};
  margin-bottom: ${props => props.theme.space[2]};
  padding-top: 0;
`

function Modal(props: ModalProps) {
  const { children } = props

  return (
    <>
      <ModalWrapper
        key="modal"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
        }}
        transition={{ type: 'spring', bounce: 0.6 }}
        initial={{ opacity: 0.66, scaleX: 0.85, scaleY: 0.9 }}
        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleX: 0, scaleY: 0 }}
      >
        {children}
      </ModalWrapper>

      <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
    </>
  )
}

function Content(props: ModalContentProps) {
  return <ContentWrapper {...props} />
}

Modal.Header = Header
Modal.Content = Content
Modal.ButtonRow = ButtonRow

export default Modal
