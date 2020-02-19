import React from 'react'

interface PlayAreaProps {
  children: any
}

export default function PlayArea(props: PlayAreaProps) {
  const { children } = props

  return <div>{children}</div>
}
