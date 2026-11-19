import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Clock } from 'lucide-react'
import { services } from '../lib/siteConfig'
import { SERVICE_PAGES } from '../lib/pages'
import './servicesTabs.css'

// Packages + prices. Used on the home page (with links to the service pages) and on
// every landing page (own title, no links: those pages have a "More services" row).
export default function ServicesTabs({ title = 'One panel, every detail spelled out', links = true }) {
  const [activeId, setActiveId] = useState(services[0].id)
  const active = services.find((s) => s.id === activeId)

  return (
    <section id="services" className="section services-tabs">
      <div className="container">
        <div className="services-tabs__head">
          <span className="eyebrow-mark">What We Offer</span>
          <h2>{title}</h2>
          <p className="services-tabs__intro">Same price for every vehicle size. We bring our own water and power.</p>
        </div>

        <div className="services-tabs__layout">
          <div className="services-tabs__list" role="tablist" aria-label="Service packages">
            {services.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={activeId === s.id}
                className={`services-tabs__tab ${activeId === s.id ? 'services-tabs__tab--active' : ''}`}
                onClick={() => setActiveId(s.id)}
              >
                <span className="services-tabs__tab-name">{s.name}</span>
                <span className="services-tabs__tab-price">{s.addOn ? '+' : ''}${s.price}</span>
              </button>
            ))}
          </div>

          <div className="services-tabs__panel">
            <div className="services-tabs__panel-head">
              <div>
                <h3>{active.name}</h3>
                <p>{active.description}</p>
                <p className="services-tabs__time"><Clock size={14} /> {active.duration}</p>
              </div>
              <div className="services-tabs__price">
                <span>{active.addOn ? '+' : ''}${active.price}</span>
                {active.addOn && <em>add-on</em>}
              </div>
            </div>
            <ul className="services-tabs__features">
              {active.features.map((f) => (
                <li key={f}><Check size={15} /> {f}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="services-tabs__cta">
          <Link to="/book" className="btn btn-primary services-tabs__cta-btn">
            Book Now <ArrowRight size={16} />
          </Link>
        </div>

        {links && (
          <nav className="seo-links" aria-label="Detailing services">
            <span>Learn more:</span>
            {SERVICE_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.nav}</Link>)}
          </nav>
        )}
      </div>
    </section>
  )
}
