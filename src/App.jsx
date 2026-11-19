import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileActionBar from './components/MobileActionBar'
import Seo from './components/Seo'
import { BookingProvider } from './lib/BookingContext'
import Home from './pages/Home'
import Book from './pages/Book'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import { LANDING_PAGES } from './lib/pages'
import './styles/seo.css'

// New page = start at the top (instantly, so it never "slides" past a section).
// Links with a #section are left alone so the browser can jump to that section.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

// BrowserRouter lives in main.jsx (browser) and StaticRouter in entry-server.jsx (prerender).
export default function App() {
  return (
    <BookingProvider>
      <Seo />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {LANDING_PAGES.map((p) => (
            <Route key={p.path} path={p.path} element={<Landing page={p} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileActionBar />
      <Toaster position="top-center" toastOptions={{
        style: { fontFamily: 'Manrope, sans-serif', fontSize: '14px' },
      }} />
    </BookingProvider>
  )
}
