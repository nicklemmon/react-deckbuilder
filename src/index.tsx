import ReactDOM from 'react-dom'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App'

inject()

ReactDOM.render(<App />, document.getElementById('root'))
