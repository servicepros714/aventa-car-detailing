import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react'
import { business, services } from '../lib/siteConfig'
import { CITY_PAGES, HOME_CITY } from '../lib/pages'
import './contactBook.css'

export default function ContactBook() {
  return (
    <section id="area" className="section contact-book">
      <div className="container contact-book__grid">
        <div>
          <span className="eyebrow-mark">Service Area</span>
          <h2>Serving Anaheim and the neighborhoods around it</h2>
          <p className="contact-book__lead">
            Aventa is fully mobile. We detail cars at homes and offices across {HOME_CITY}, including
            West Anaheim, and in nearby Villa Park, North Tustin and Orange Park Acres.
          </p>
          <ul className="lp-chips">
            {CITY_PAGES.map((p) => <li key={p.path}><Link to={p.path}>{p.city}</Link></li>)}
          </ul>
          <div className="contact-book__list">
            <a href={business.phoneHref}><Phone size={17} /> {business.phone}</a>
            <span><MapPin size={17} /> Mobile service: we come to you</span>
            <span><Clock size={17} /> {business.hours}</span>
          </div>
        </div>
        <div className="quick-book">
          <span className="quick-book__eyebrow">Ready when you are</span>
          <h3>Book your detail</h3>
          <p>Pick a package, date and time. Questions first? Call or text {business.phone}.</p>
          <ul className="quick-book__list">
            {services.map((s) => (
              <li key={s.id}>{s.name} <span>{s.addOn ? '+' : ''}${s.price}</span></li>
            ))}
          </ul>
          <Link to="/book" className="btn btn-primary btn-block quick-book__btn">
            Book Online <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
