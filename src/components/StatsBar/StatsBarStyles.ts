import styled from 'styled-components'

export const OuterWrapper = styled.div<{ status: string }>`
  position: relative;
  display: flex;
  border-radius: ${props => props.theme.radii[0]};
  overflow: hidden;
  height: ${props => props.theme.space[3]};
  width: 100%;
  border: 1px solid ${props => props.theme.colors.darkGray};
  background: ${props =>
    `linear-gradient(180deg, ${props.theme.colors.darkGray} 10%, ${props.theme.colors.gray} 100%)`};
  box-shadow: ${props => props.theme.shadows[0]},
    0px 0px 0px 1px ${props => props.theme.colors.lightGray};
`

export const Fill = styled.div<{ percentage: number; status: string }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => `${props.percentage}%`};
  background-color: ${props => props.theme.colors.red};
  background: ${props =>
    `linear-gradient(180deg, ${props.theme.colors.lightRed} 0%, ${props.theme.colors.darkRed} 80%, ${props.theme.colors.darkRed} 100%)`};
`
