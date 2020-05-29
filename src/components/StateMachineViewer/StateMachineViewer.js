import React from 'react'
import styled from 'styled-components'

const StyledStateMachineViewer = styled('div')`
  position: fixed;
  z-index: 5;
  bottom: 1rem;
  left: 1rem;
  background-color: #293845d1;
  color: #fff;
  padding: 1rem;
  width: 300px;
  font-family: monospace;
  border-radius: ${props => props.theme.radii[1]};
`

export default function StateMachineViewer(props) {
  const { currentState } = props

  return (
    <StyledStateMachineViewer>
      <p>
        <strong>State:</strong>
      </p>

      <pre>{currentState.value}</pre>
    </StyledStateMachineViewer>
  )
}
