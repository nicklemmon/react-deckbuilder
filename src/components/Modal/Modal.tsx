import React from 'react'
import { motion } from 'framer-motion'
import { transparentize, lighten } from 'polished'
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
  width: 100%;
  max-width: 900px;
  height: 80vh;
  border-radius: ${props => props.theme.radii[2]};
  color: ${props => props.theme.colors.white};
  background: ${props =>
    `linear-gradient(0deg, ${props.theme.colors.white}, ${lighten(
      0.05,
      props.theme.colors.offWhite,
    )})`};
  box-shadow: 0 0 ${props => props.theme.space[4]}
    ${props => transparentize(0.5, props.theme.colors.darkGray)};
`

const Content = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
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
`

interface ModalProps {
  children: any
}

function Modal(props: ModalProps) {
  const { children } = props

  return (
    <>
      <ModalWrapper
        transition={{ type: 'spring', damping: 150 }}
        initial={{ scale: 1, y: '100%', x: '-50%' }}
        animate={{ scale: 1.1, y: '-50%', x: '-50%' }}
        exit={{ scale: 1, y: '100%', x: '-50%' }}
      >
        {children}
      </ModalWrapper>
      <Overlay
        transition={{ type: 'spring', delay: 0.25 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    </>
  )
}

Modal.ButtonRow = ButtonRow
Modal.Content = Content

export default Modal
