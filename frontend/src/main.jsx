import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ display: "flex", justifyContent: "center" }}></div>
    <App />
  </StrictMode>,
)
