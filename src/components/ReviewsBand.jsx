import React, { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { REVIEWS, GOOGLE_PROFILE_URL } from '../lib/siteConfig'
import './reviewsBand.css'

// Confirmed facts only (no ratings or counts).
const stats = [
  { num: '$150', label: 'Interior details from' },
  { num: 'Any size', label: 'Same price' },
  { num: '7 days', label: '7 AM – 7 PM' },
]

// Real Google reviews only (src/lib/siteConfig.js). With none yet, the right side
// links to the Google profile instead.
export default function ReviewsBand() {
  const [index, setIndex] = useState(0)
  const review = REVIEWS[index]
  const go = (dir) => setIndex((i) => (i + dir + REVIEWS.length) % REVIEWS.length)

  return (
    <section id="reviews" className="section section--dark reviews-band">
      <div className="container reviews-band__grid">
        <div className="reviews-band__stats">
          <span className="eyebrow-mark">At a Glance</span>
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
          {review ? (
            <>
              <div className="review-slide">
                <div className="review-slide__stars" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="#4FA8E0" stroke="none" />)}
                </div>
                <p>&ldquo;{review.text}&rdquo;</p>
                <div className="review-slide__author">
                  <strong>{review.name}</strong>
                  <span>Google review</span>
                </div>
              </div>
              {REVIEWS.length > 1 && (
                <div className="review-slide__controls">
                  <button onClick={() => go(-1)} aria-label="Previous review"><ChevronLeft size={18} /></button>
                  <div className="review-slide__dots">
                    {REVIEWS.map((r, i) => <span key={r.name} className={i === index ? 'is-active' : ''} />)}
                  </div>
                  <button onClick={() => go(1)} aria-label="Next review"><ChevronRight size={18} /></button>
                </div>
              )}
            </>
          ) : (
            <div className="reviews-band__fallback">
              <h2 className="reviews-band__title">Find us on Google</h2>
              <p>See Aventa Car Detailing Anaheim on Google, or leave a review after your detail.</p>
            </div>
          )}
          {GOOGLE_PROFILE_URL && (
            <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline reviews-band__google">
              {review ? 'See all reviews on Google' : 'Aventa on Google'}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
