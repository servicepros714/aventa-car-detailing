import React from 'react'
import './processSteps.css'

const steps = [
  { title: 'Book online', body: 'Pick a package, date, and time. Takes under two minutes.' },
  { title: 'We confirm & arrive', body: "You'll get a text confirmation and an on-the-way heads up." },
  { title: 'Full detail on-site', body: 'We work at your address — no drop-off, no waiting around a shop.' },
  { title: 'Drive away happy', body: 'Quick walkthrough before we go. Not satisfied? We fix it on the spot.' },
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
