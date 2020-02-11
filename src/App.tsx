import React from 'react'
import { Card } from './components/Card'

// Do this at the root of your application
export default function App() {
  return (
    <div>
      <Card name="hello" rarity={3} description="This is a description" />
    </div>
  )
}
