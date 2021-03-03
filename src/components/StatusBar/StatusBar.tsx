import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

interface StatusBarProps {
  children: React.ReactChild | React.ReactChild[]
}

interface StatusBarButtonProps extends React.ComponentPropsWithRef<'button'> {
  children: React.ReactChild
  status: 'idle' | 'disabled'
}

const StatusBarWrapper = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
`

const StatusBarContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 2;
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.darkGray};
  padding: ${props => props.theme.space[3]};
  padding-top: ${props => props.theme.space[2]};
  clip-path: polygon(100% 0, 100% 95%, 99% 100%, 1% 100%, 0 90%, 0 0);
  border: 1px solid ${props => props.theme.colors.offWhite};
  border-top: 0;
  box-shadow: inset 0 -5px 0 ${props => props.theme.colors.offWhite};

  > * + * {
    margin-left: ${props => props.theme.space[3]};
  }
`

const StatusBarShadow = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  border-radius: 0.5rem;
  height: 90%;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
`

const StatusBarBtn = styled.button<{ status: string }>`
  border-radius: 50%;
  appearance: none;
  border: 0;
  border: 2px solid ${props => props.theme.colors.white};
  width: 1.85rem;
  height: 1.85rem;
  display: flex;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 0 4px 4px -1px rgba(0, 0, 0, 0.25);
  transition-timing-function: ease-in-out;
  transition-duration: ${props => props.theme.duration[0]};
  transition-property: background, box-shadow, transform;
  pointer-events: ${props => (props.status === 'disabled' ? 'none' : 'initial')};
  filter: ${props => (props.status === 'disabled' ? 'grayscale(95%)' : 'initial')};

  * + * {
    margin-left: ${props => props.theme.space[3]};
  }

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${props => transparentize(0.5, props.theme.colors.offWhite)};
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.25);
  }
`

const StatusBarBtnImg = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  transform: rotate(15deg);
`

function StatusBarButton(props: StatusBarButtonProps) {
  const { children, onClick, status = 'idle ' } = props

  return (
    <StatusBarBtn onClick={onClick} status={status}>
      {children}
    </StatusBarBtn>
  )
}

function StatusBar(props: StatusBarProps) {
  const { children } = props

  return (
    <StatusBarWrapper>
      <StatusBarContent>{children}</StatusBarContent>

      <StatusBarShadow />
    </StatusBarWrapper>
  )
}

StatusBar.Button = StatusBarButton
StatusBar.ButtonImg = StatusBarBtnImg

export { StatusBar }
