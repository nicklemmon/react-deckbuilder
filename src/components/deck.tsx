import React from 'react'
import { clsx } from 'clsx'
import css from './deck.module.css'

export function Deck({
  children,
  isStacked = true,
  align = 'left',
}: {
  children: React.ReactNode
  isStacked?: boolean
  align?: 'left' | 'right'
}) {
  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          cardIndex: index,
          isStacked,
          align,
          style: {
            ...child.props.style,
            transform: `translateX(calc(-${index} * 3rem))`,
          },
        })
      }

      return child
    })
  }

  return (
    <div
      className={clsx({
        [css['deck']]: true,
        [css['stacked']]: isStacked === true,
        [css['align-left']]: align === 'left',
        [css['align-right']]: align === 'right',
      })}
    >
      {React.Children.map(children, (child, index) => {
        return (
          <div
            key={`deckchild${index}`}
            style={{
              transform: `translateX(calc(-${index} * 11.15rem))`,
            }}
          >
            {child}
          </div>
        )
      })}

      {isStacked ? <div style={{ clear: 'both' }} /> : null}
    </div>
  )
}
