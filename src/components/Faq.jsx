import React from 'react'
import { Plus } from 'lucide-react'
import { business, FAQS } from '../lib/siteConfig'

// FAQ list. The same questions feed the FAQPage schema in src/lib/seo.js,
// so everything listed here must stay visible on the page.
export default function Faq({ faqs = FAQS, title = 'Questions, answered' }) {
  return (
    <section id="faq" className="section faq-section">
      <div className="container faq-grid">
        <div className="faq-side">
          <span className="eyebrow-mark">FAQ</span>
          <h2>{title}</h2>
          <p>Something else? Call or text <a href={business.phoneHref}>{business.phone}</a>.</p>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>
                <span>{f.q}</span>
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
