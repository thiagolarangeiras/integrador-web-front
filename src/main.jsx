import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SignUp_Up from './pages/SignUp_In/Up/Up.jsx'
import SignUp_In from './pages/SignUp_In/In/in.jsx'
import './index.css'
import Home from './pages/home/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Home />
  </StrictMode>,
)
