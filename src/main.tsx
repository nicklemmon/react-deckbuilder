import React from 'react'
import { inject } from '@vercel/analytics'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './global.css'

inject()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
