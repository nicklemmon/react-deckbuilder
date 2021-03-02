import React from 'react'
import { motion } from 'framer-motion'
import { transparentize, darken } from 'polished'
import styled from 'styled-components'

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 49;
  background-color: ${props => transparentize(0.4, props.theme.colors.darkGray)};
`

const ModalWrapper = styled(motion.div)`
  z-index: 50;
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

const Content = styled.div`
  width: 100%;
  padding: ${props => props.theme.space[5]};
`

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${props => props.theme.space[5]};
  padding-top: 0;
`

interface ModalProps {
  children: any
}

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

Modal.ButtonRow = ButtonRow
Modal.Content = Content

export default Modal
