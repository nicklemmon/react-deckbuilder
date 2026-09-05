import React from 'react'
import { inject } from '@vercel/analytics'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './global.css'

inject()

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
