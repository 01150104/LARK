import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LarkLanding from './LarkLanding.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LarkLanding />
  </StrictMode>,
)
