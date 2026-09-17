import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

const initialState = {
  serviceId: null,
  addExterior: false,
  date: null, // yyyy-MM-dd
  dateLabel: null,
  time: null,
  fullName: '',
  phone: '',
  email: '',
  address: '',
  vehicle: '', // service-specific field (year/make/model)
  notes: '',
  couponApplied: false,
  payLater: false,
}

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(initialState)

  const updateBooking = (patch) => setBooking((prev) => ({ ...prev, ...patch }))
  const resetBooking = () => setBooking(initialState)

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
