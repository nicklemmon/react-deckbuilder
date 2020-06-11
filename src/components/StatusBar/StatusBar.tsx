import React from 'react'
import styled from 'styled-components'

interface StatusBarProps {
  children: any
}

const StatusBarWrapper = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
`

const StatusBarShape = styled.div`
  position: relative;
  display: flex;
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

export default function StatusBar(props: StatusBarProps) {
  const { children } = props

  return (
    <StatusBarWrapper>
      <StatusBarShape>{children}</StatusBarShape>

      <StatusBarShadow />
    </StatusBarWrapper>
  )
}
