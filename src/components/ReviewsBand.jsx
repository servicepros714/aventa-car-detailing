import React, { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import './reviewsBand.css'

const reviews = [
  {
    name: 'Marcus T.',
    vehicle: 'GMC Sierra Denali',
    quote: 'They got stains out of my seats I figured were permanent. Truck looked better than the day I bought it.',
  },
  {
    name: 'Priya S.',
    vehicle: 'Toyota Tacoma',
    quote: "Booking online took two minutes and they texted when they were on the way. Easiest appointment I've made.",
  },
  {
    name: 'Daniel R.',
    vehicle: 'Infiniti Q60',
    quote: 'Exterior finish is showroom-level. Paid for the Premium package and it was worth every dollar.',
  },
]

const stats = [
  { num: '500+', label: 'Vehicles Detailed' },
  { num: '4.9★', label: 'Average Rating' },
  { num: '100%', label: 'Hand-Finished' },
]

export default function ReviewsBand() {
  const [index, setIndex] = useState(0)
  const review = reviews[index]

  const go = (dir) => setIndex((i) => (i + dir + reviews.length) % reviews.length)

  return (
    <section id="reviews" className="section section--dark reviews-band">
      <div className="container reviews-band__grid">
        <div className="reviews-band__stats">
          <span className="eyebrow-mark">By The Numbers</span>
          <div className="reviews-band__stats-list">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-band__carousel">
          <div className="review-slide">
            <div className="review-slide__stars">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="#4FA8E0" stroke="none" />)}
            </div>
            <p>&ldquo;{review.quote}&rdquo;</p>
            <div className="review-slide__author">
              <strong>{review.name}</strong>
              <span>{review.vehicle}</span>
            </div>
          </div>
          <div className="review-slide__controls">
            <button onClick={() => go(-1)} aria-label="Previous review"><ChevronLeft size={18} /></button>
            <div className="review-slide__dots">
              {reviews.map((_, i) => (
                <span key={i} className={i === index ? 'is-active' : ''} />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Next review"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
