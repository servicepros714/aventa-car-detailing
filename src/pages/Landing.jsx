import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, MapPin, Phone } from 'lucide-react'
import { business, services } from '../lib/siteConfig'
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages'
import ServicesTabs from '../components/ServicesTabs'
import Faq from '../components/Faq'

// One template for every SEO landing page in src/lib/pages.js.

const [basic, premium, wash] = services

// Hero price card: a detail, or 'combo' = Premium Interior Detail + Exterior Wash.
// The Exterior Wash is never shown as a product on its own.
function HeroCard({ page }) {
  const combo = page.card === 'combo'
  const pkg = combo ? premium : services.find((s) => s.id === page.card)
  const name = combo ? `${premium.name} + ${wash.name}` : pkg.name
  const price = combo ? premium.price + wash.price : pkg.price
  const items = combo
    ? ['Everything in the Premium Interior Detail', 'Full Interior Shampooing', 'UV-Protectant Coating', 'Hand-Washed Exterior', 'Rims, Tires & Tire Shine', 'Spot-Free Hand Drying']
    : pkg.features
  return (
    <aside className="quick-book lp-card" aria-label={name}>
      <span className="quick-book__eyebrow">{combo ? 'Inside + out' : 'Most complete'}</span>
      <h2 className="lp-card__title">{name}</h2>
      <div className="lp-card__price">${price}</div>
      <p className="lp-card__time"><Clock size={14} /> {combo ? `${premium.duration} + ${wash.duration.replace('adds ', '')}` : pkg.duration}</p>
      <ul className="lp-card__list">
        {items.map((f) => <li key={f}><Check size={15} /> {f}</li>)}
      </ul>
      <Link to="/book" className="btn btn-primary btn-block quick-book__btn">
        {combo ? 'Book Premium + Wash' : `Book ${pkg.name.split(' ')[0]}`} <ArrowRight size={16} />
      </Link>
      <p className="lp-card__note">
        {combo
          ? `Or the Basic Detail + wash for $${basic.price + wash.price}.`
          : 'Prepay online with code PREPAY and save $15, or pay later.'}
      </p>
    </aside>
  )
}

function Related({ page }) {
  const svc = SERVICE_PAGES.filter((p) => p.path !== page.path)
  const areas = CITY_PAGES.filter((p) => p.path !== page.path)
  return (
    <section className="section lp-related" aria-label="More from Aventa">
      <div className="container lp-related__grid">
        <div>
          <h2 className="lp-related__title">More services</h2>
          <ul className="lp-chips">
            {svc.map((p) => <li key={p.path}><Link to={p.path}>{p.nav}</Link></li>)}
            <li><a href="/#services">All prices</a></li>
          </ul>
        </div>
        <div>
          <h2 className="lp-related__title">Areas we serve</h2>
          <ul className="lp-chips">
            <li><Link to="/">{HOME_CITY}</Link></li>
            {areas.map((p) => <li key={p.path}><Link to={p.path}>{p.city}</Link></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function Landing({ page }) {
  const { local, intro } = page
  const isCity = page.kind === 'city'

  return (
    <>
      <section className="lp-hero">
        <div className="container lp-hero__grid">
          <div>
            <nav className="lp-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.nav}</span>
            </nav>
            <span className="eyebrow-mark">{page.eyebrow}</span>
            <h1 className="lp-title">
              {page.h1[0]} <span>{page.h1[1]}</span>
            </h1>
            <p className="lp-lede">{page.lede}</p>
            <div className="lp-ctas">
              <Link to="/book" className="btn btn-primary">Book Online <ArrowRight size={16} /></Link>
              <a href={business.phoneHref} className="btn btn-outline lp-call"><Phone size={16} /> {business.phone}</a>
            </div>
            <ul className="lp-facts">
              {page.facts.map((f) => <li key={f}><Check size={15} /> {f}</li>)}
            </ul>
          </div>
          <HeroCard page={page} />
        </div>
      </section>

      <section className="section">
        <div className="container lp-intro">
          <div>
            <span className="eyebrow-mark">{isCity ? page.city : 'Overview'}</span>
            <h2 className="lp-h2">{intro.h2}</h2>
            {intro.paras.map((p) => <p key={p} className="lp-para">{p}</p>)}
          </div>
          <figure className="lp-photo">
            <img src={page.photo.src} alt={page.photo.alt} width={page.photo.w} height={page.photo.h} loading="lazy" />
          </figure>
        </div>
      </section>

      <ServicesTabs title={isCity ? `Prices in ${page.city}` : 'Two details and an add-on'} links={false} />

      <section className="section section--dark">
        <div className="container">
          <span className="eyebrow-mark">Why Aventa</span>
          <h2 className="lp-h2 lp-h2--light">{isCity ? `Why book us in ${page.city}` : 'Why book Aventa'}</h2>
          <ul className="lp-points">
            {page.points.map((pt) => (
              <li key={pt.title}>
                <h3>{pt.title}</h3>
                <p>{pt.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq faqs={page.faqs} title={`${page.nav} questions`} />

      {local && (
        <section className="section lp-local">
          <div className="container lp-local__grid">
            <div>
              <span className="eyebrow-mark">Service Area</span>
              <h2 className="lp-h2">{local.h2}</h2>
              <p className="lp-para">{local.text}</p>
              <p className="lp-spots-label"><MapPin size={14} /> {local.spotsLabel}</p>
              <ul className="lp-chips lp-chips--plain">
                {local.spots.map((s) => <li key={s}><span>{s}</span></li>)}
              </ul>
              <ul className="lp-info">
                <li><Clock size={15} /> {business.hours}</li>
                <li><Phone size={15} /> <a href={business.phoneHref}>{business.phone}</a></li>
              </ul>
            </div>
            <div className="lp-map">
              <iframe
                title={`Map of ${local.map}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(local.map)}&output=embed`}
                width="100%"
                height="380"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      <Related page={page} />

      <section className="section section--dark lp-cta">
        <div className="container lp-cta__inner">
          <div>
            <h2 className="lp-h2 lp-h2--light">Ready for a cleaner ride?</h2>
            <p>{business.hours}. We come to you.</p>
          </div>
          <Link to="/book" className="btn btn-primary">Book Online <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  )
}
