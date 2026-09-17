// Booking API client — talks to the Cloudflare Worker backed by the shared
// `detailing-bookings` D1 database. All requests are source-scoped to
// SOURCE_TAG so this site only ever sees/affects its own rows.

import { SOURCE_TAG } from './siteConfig'

const API_URL = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Booking API error (${res.status}): ${text || res.statusText}`)
  }
  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : null
}

/** Returns booked time slots for a given date (YYYY-MM-DD), scoped to this site. */
export async function getBookedSlots(date) {
  const data = await request(`/api/availability?source=${SOURCE_TAG}&date=${date}`)
  return data?.bookedSlots ?? []
}

/** Creates a new booking. Returns the created booking record including its id. */
export async function createBooking(booking) {
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ ...booking, source: SOURCE_TAG }),
  })
}

/** Marks a booking's payment status after a successful Stripe confirmation. */
export async function markBookingPaid(bookingId, paymentStatus) {
  return request(`/api/bookings/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify({ payment_status: paymentStatus }),
  })
}

/** Fetches a single booking by id, for the confirmation page. */
export async function getBooking(bookingId) {
  return request(`/api/bookings/${bookingId}?source=${SOURCE_TAG}`)
}
