import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/base.css'
import './styles/ambient.css'
import './styles/intro.css'
import './styles/reader.css'
import './styles/book.css'
import './styles/zoom.css'
import './styles/end.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
