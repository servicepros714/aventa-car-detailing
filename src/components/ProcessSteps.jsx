import React from 'react'
import './processSteps.css'

const steps = [
  { title: 'Book online', body: 'Pick a package, date and time. Any day, 7 AM to 7 PM.' },
  { title: 'We arrive', body: 'We come to your address at the time you picked, with our own water and power.' },
  { title: 'Full detail on-site', body: 'We work at your address: no drop-off, no waiting around a shop.' },
  { title: 'Drive away happy', body: 'Not satisfied? Every detail comes with our satisfaction guarantee.' },
]

export default function ProcessSteps() {
  return (
    <section className="section process">
      <div className="container">
        <span className="eyebrow-mark">How It Works</span>
        <h2 className="process__title">From booking to a clean car, four steps</h2>
        <ol className="process__list">
          {steps.map((s, i) => (
            <li key={s.title} className="process__step">
              <span className="process__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
