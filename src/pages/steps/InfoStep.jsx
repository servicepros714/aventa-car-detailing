import React from 'react'
import { formatPhone } from '../../lib/format'

export default function InfoStep({ booking, updateBooking, errors }) {
  return (
    <div className="step-info">
      <div className="step-info__grid">
        <div className="field field--full">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={booking.fullName}
            onChange={(e) => updateBooking({ fullName: e.target.value })}
            placeholder="Jane Doe"
          />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <div className="phone-field">
            <span className="phone-field__flag">
              <img src="https://flagcdn.com/w20/us.png" alt="" width="20" /> +1
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={booking.phone}
              onChange={(e) => updateBooking({ phone: formatPhone(e.target.value) })}
              placeholder="(714) 555-0123"
            />
          </div>
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={booking.email}
            onChange={(e) => updateBooking({ email: e.target.value })}
            placeholder="jane@email.com"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field field--full">
          <label htmlFor="address">Service Address</label>
          <input
            id="address"
            type="text"
            value={booking.address}
            onChange={(e) => updateBooking({ address: e.target.value })}
            placeholder="123 Main St, Anaheim, CA"
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="field field--full">
          <label htmlFor="vehicle">Vehicle (Year, Make, Model)</label>
          <input
            id="vehicle"
            type="text"
            value={booking.vehicle}
            onChange={(e) => updateBooking({ vehicle: e.target.value })}
            placeholder="2022 Toyota Tacoma"
          />
          {errors.vehicle && <span className="field-error">{errors.vehicle}</span>}
        </div>

        <div className="field field--full">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            rows={3}
            value={booking.notes}
            onChange={(e) => updateBooking({ notes: e.target.value })}
            placeholder="Gate code, parking instructions, areas to focus on…"
          />
        </div>
      </div>
    </div>
  )
}
