import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Global styles first, so component stylesheets (imported via App) can override them.
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Prerendered pages already have HTML in #root: hydrate it. Booking pages are empty: render.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
