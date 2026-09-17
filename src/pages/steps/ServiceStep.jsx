import React from 'react'
import { Sparkles, Gem, Check, CheckCircle2, Circle } from 'lucide-react'
import { services } from '../../lib/siteConfig'

const detailServices = services.filter((s) => !s.addOn)
const cardIcons = { basic: Sparkles, premium: Gem }

export default function ServiceStep({ booking, updateBooking }) {
  return (
    <div className="step-service">
      <div className="step-service__grid">
        {detailServices.map((s) => {
          const Icon = cardIcons[s.id]
          const selected = booking.serviceId === s.id
          return (
            <button
              key={s.id}
              type="button"
              className={`step-service__card ${selected ? 'step-service__card--selected' : ''}`}
              onClick={() => updateBooking({ serviceId: s.id })}
              aria-pressed={selected}
            >
              <span className="step-service__check">
                {selected ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </span>
              <span className="step-service__icon"><Icon size={20} /></span>
              <h3>{s.name}</h3>
              <div className="price">${s.price}</div>
              <p className="step-service__desc">{s.description}</p>
              <ul className="step-service__features">
                {s.features.map((f) => (
                  <li key={f}><Check size={14} /> {f}</li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
    </div>
  )
}
