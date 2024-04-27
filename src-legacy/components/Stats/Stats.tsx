import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  + * {
    margin-top: ${(props) => props.theme.space[2]};
  }

  > * + * {
    margin-left: ${(props) => props.theme.space[3]};
  }
`

const Stat = styled.div<{ appearance?: 'normal' | 'inverted' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.appearance === 'inverted' ? props.theme.colors.white : props.theme.colors.darkGray};
`

const Icon = styled.img`
  width: 1.85rem;
  height: 1.85rem;
  border-radius: ${(props) => props.theme.radii[0]};
  overflow: hidden;
`

const Value = styled.span`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: ${(props) => props.theme.fontSizes[1]};
  margin-left: ${(props) => props.theme.space[2]};
  color: currentColor;
`

interface StatsProps {
  children: any
}

function Stats(props: StatsProps) {
  const { children } = props

  return <div>{children}</div>
}

Row.displayName = 'Stats.Row'
Stats.Row = Row
Stat.displayName = 'Stats.Stat'
Stats.Stat = Stat
Icon.displayName = 'Stats.Icon'
Stats.Icon = Icon
Value.displayName = 'Stats.Value'
Stats.Value = Value

export default Stats
