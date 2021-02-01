import React from 'react'
import styled from 'styled-components'
import { StackProps } from './types'

const ChildEl = styled.div<{ hasGutter: boolean }>`
  padding-bottom: ${props => (props.hasGutter ? props.theme.space[4] : 0)};
`

// TODO: Add support for passing in a custom space value
export default function Stack(props: StackProps) {
  const items = React.Children.toArray(props.children)

  if (items.length === 0) return <>{items}</>

  return (
    <div>
      {items.map((child, index) => {
        const hasGutter = index < items.length - 1

        return (
          <ChildEl key={`stack-${index}`} hasGutter={hasGutter}>
            {child}
          </ChildEl>
        )
      })}
    </div>
  )
}
