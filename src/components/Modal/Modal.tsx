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
  position: fixed;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* centering hack */
  width: 100%;
  max-width: 900px;
  height: 80vh;
  display: flex;
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
  height: 100%;
  width: 100%;
  padding: ${props => props.theme.space[5]};
`

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${props => props.theme.space[4]} ${props => props.theme.space[5]};
  border-top: ${props => `1px solid ${props.theme.colors.darkGray}`};
`

interface ModalProps {
  children: any
}

function Modal(props: ModalProps) {
  const { children } = props

  return (
    <>
      <ModalWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {children}
      </ModalWrapper>
      <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
    </>
  )
}

Modal.ButtonRow = ButtonRow
Modal.Content = Content

export default Modal
