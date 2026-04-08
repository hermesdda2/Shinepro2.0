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

// Watch for React to paint real content into #root, then remove loader
const observer = new MutationObserver(() => {
  const root = document.getElementById('root')
  if (root && root.children.length > 1) {
    observer.disconnect()
    removeLoader()
  }
})
observer.observe(document.getElementById('root'), { childList: true })

// Safety fallback: remove loader after 5s no matter what
setTimeout(removeLoader, 5000)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


