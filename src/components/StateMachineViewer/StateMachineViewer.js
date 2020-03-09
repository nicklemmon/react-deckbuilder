import React from 'react'
import styled from 'styled-components'

const StyledStateMachineViewer = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  background-color: #293845;
  color: #fff;
  padding: 30px;
  width: 300px;
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
