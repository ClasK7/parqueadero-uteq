import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@coreui/coreui/dist/css/coreui.min.css' // <-- Estilos de la plantilla CoreUI
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)