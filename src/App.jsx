import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileActionBar from './components/MobileActionBar'
import { BookingProvider } from './lib/BookingContext'
import Home from './pages/Home'
import Book from './pages/Book'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'

export default function App() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
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
