import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Phone, Calendar } from 'lucide-react'
import { business } from '../lib/siteConfig'
import { getBooking } from '../lib/bookingDb'
import './confirmation.css'

export default function Confirmation() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    if (!id) return
    getBooking(id).then(setDetails).catch(() => {})
  }, [id])

  return (
    <div className="confirmation-page">
      <div className="container confirmation-card">
        <CheckCircle2 size={56} className="confirmation-card__icon" />
        <h1>You're booked!</h1>
        <p>
          {id ? <>Confirmation <strong>{id}</strong> — a</> : 'A'} confirmation has been sent to your email.
          We'll see you soon.
        </p>

        {details && (
          <div className="confirmation-details">
            <div><Calendar size={16} /> {details.date} · {details.time}</div>
            <div>{details.service}</div>
            <div>{details.address}</div>
          </div>
        )}

        <div className="confirmation-actions">
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <a href={business.phoneHref} className="btn btn-outline"><Phone size={16} /> Call Us</a>
        </div>
      </div>
    </div>
  )
}
