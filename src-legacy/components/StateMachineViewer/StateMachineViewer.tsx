import styled from 'styled-components'

interface StateMachineViewerProps {
  state: any // TODO: Implement real type
}

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
  border-radius: ${(props) => props.theme.radii[1]};
`

export default function StateMachineViewer(props: StateMachineViewerProps) {
  const { state } = props

  return (
    <StyledStateMachineViewer>
      <p>
        <strong>State:</strong>
      </p>

      <pre>{JSON.stringify(state.value)}</pre>
    </StyledStateMachineViewer>
  )
}
