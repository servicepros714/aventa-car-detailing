// Booking API client — talks to the Cloudflare Worker backed by the
// `detailing-bookings-remoticojobs` D1 database. The Worker scopes every
// request to this site's source tag, so this site only ever sees its own rows.
// Prices and payment status are decided by the Worker, never sent from here.

import { SOURCE_TAG } from './siteConfig'

const API_URL = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const err = new Error(data?.error || `Booking API error (${res.status})`)
    err.status = res.status
    throw err
  }
  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : null
}

/** Returns booked time slots for a given date (YYYY-MM-DD), scoped to this site. */
export async function getBookedSlots(date) {
  const data = await request(`/api/availability?source=${SOURCE_TAG}&date=${date}`)
  return data?.bookedSlots ?? []
}

/**
 * Creates a new booking (always 'Pay Later' until the Stripe webhook confirms payment).
 * Returns { id, date, time, service, address, subtotal, coupon, total }.
 */
export async function createBooking(booking) {
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  })
}

/** Confirms a Pay Later booking, which triggers the booking-confirmation notification. */
export async function confirmPayLater(bookingId, email) {
  return request(`/api/bookings/${bookingId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}
