import styled from 'styled-components'

export const FeedbackText = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes[3]};
  color: ${props => props.theme.colors.pink};
  text-shadow: 0 0 15px ${props => props.theme.colors.white},
    0 2px 0 ${props => props.theme.colors.darkPink};
`
