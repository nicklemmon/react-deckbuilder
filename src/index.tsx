import React from 'react'
import ReactDOM from 'react-dom'
import { bundleLoadEvent } from 'src/events'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
// Dispatches only after the app is mounted (therefore the bundle has loaded)
window.dispatchEvent(bundleLoadEvent)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
