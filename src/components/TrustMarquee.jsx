import React from 'react'
import { ShieldCheck, Star, Sparkles, Clock3 } from 'lucide-react'
import './trustMarquee.css'

const items = [
  { icon: Star, text: '4.9 average rating' },
  { icon: ShieldCheck, text: 'Satisfaction guaranteed' },
  { icon: Sparkles, text: '500+ vehicles detailed' },
  { icon: Clock3, text: 'Same-week booking' },
]

export default function TrustMarquee() {
  const row = [...items, ...items, ...items]
  return (
    <div className="marquee" aria-hidden="false">
      <div className="marquee__track">
        {row.map(({ icon: Icon, text }, i) => (
          <span className="marquee__item" key={i}>
            <Icon size={15} /> {text}
          </span>
        ))}
      </div>
    </div>
  )
}
