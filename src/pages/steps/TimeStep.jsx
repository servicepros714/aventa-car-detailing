import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { TIME_SLOTS, isSlotInPast } from '../../lib/availability'
import { getBookedSlots } from '../../lib/bookingDb'

export default function TimeStep({ booking, updateBooking }) {
  const [bookedSlots, setBookedSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!booking.date) return
    let cancelled = false
    setLoading(true)
    getBookedSlots(booking.date)
      .then((slots) => { if (!cancelled) setBookedSlots(slots) })
      .catch(() => { if (!cancelled) toast.error("Couldn't load availability. Showing all slots.") })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [booking.date])

  if (!booking.date) {
    return <div className="step-time__empty">Pick a date first to see available times.</div>
  }

  if (loading) {
    return <div className="step-time__empty">Loading availability…</div>
  }

  return (
    <div className="step-time__grid">
      {TIME_SLOTS.map((slot) => {
        const taken = bookedSlots.includes(slot) || isSlotInPast(booking.date, slot)
        const selected = booking.time === slot
        return (
          <button
            key={slot}
            type="button"
            disabled={taken}
            className={`step-time__slot ${selected ? 'step-time__slot--selected' : ''} ${taken ? 'step-time__slot--taken' : ''}`}
            onClick={() => updateBooking({ time: slot })}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}
