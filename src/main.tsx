import React, { lazy, Suspense } from 'react'
import { inject } from '@vercel/analytics'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './global.css'

inject()

const CardFinishesDemo = lazy(() =>
  import('./components/card-finishes-demo').then((module) => ({
    default: module.CardFinishesDemo,
  })),
)

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {window.location.pathname === '/card-finishes' ? (
      <Suspense fallback={<p>Loading card finishes…</p>}>
        <CardFinishesDemo />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
