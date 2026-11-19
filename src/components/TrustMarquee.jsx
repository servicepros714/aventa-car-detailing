import React from 'react'
import { ShieldCheck, Droplets, Car, Clock3 } from 'lucide-react'
import './trustMarquee.css'

// Confirmed facts only (no ratings, counts or availability promises).
const items = [
  { icon: ShieldCheck, text: 'Satisfaction guaranteed' },
  { icon: Droplets, text: 'We bring water & power' },
  { icon: Car, text: 'Same price, any vehicle size' },
  { icon: Clock3, text: 'Open 7 days, 7 AM – 7 PM' },
]

export default function TrustMarquee() {
  const row = [...items, ...items, ...items]
  return (
    <div className="marquee">
      <div className="marquee__track">
        {row.map(({ icon: Icon, text }, i) => (
          <span className="marquee__item" key={i} aria-hidden={i >= items.length ? 'true' : undefined}>
            <Icon size={15} /> {text}
          </span>
        ))}
      </div>
    </div>
  )
}
