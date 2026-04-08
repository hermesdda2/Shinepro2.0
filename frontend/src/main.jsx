import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

function removeLoader() {
  const loader = document.getElementById('sp-loader')
  if (!loader) return
  loader.style.transition = 'opacity 0.3s ease'
  loader.style.opacity = '0'
  setTimeout(() => loader.remove(), 300)
}

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App onReady={removeLoader} />
  </StrictMode>,
)


