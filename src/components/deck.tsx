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
      return React.cloneElement(child, {
        cardIndex: index,
        isStacked,
        align,
      })
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
      {renderChildren()}

      {isStacked ? <div style={{ clear: 'both' }} /> : null}
    </div>
  )
}
