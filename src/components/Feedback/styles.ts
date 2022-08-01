import styled from 'styled-components'

export const FeedbackText = styled.div<{ variant: 'neutral' | 'positive' | 'negative' }>`
  font-family: ${props => props.theme.fonts.heading};
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes[3]};
  color: ${props => props.theme.colors[getColor(props.variant)]};
  text-shadow: 0 2px 1px ${props => props.theme.colors[getShadowColor(props.variant)]};
`

function getColor(variant: 'neutral' | 'positive' | 'negative'): string {
  switch (variant) {
    case 'neutral': {
      return 'white'
    }

    case 'positive': {
      return 'green'
    }

    case 'negative':
    default: {
      return 'red'
    }
  }
}

function getShadowColor(variant: 'neutral' | 'positive' | 'negative'): string {
  switch (variant) {
    case 'neutral': {
      return 'darkGray'
    }

    case 'positive': {
      return 'darkGreen'
    }

    case 'negative':
    default: {
      return 'darkRed'
    }
  }
}
