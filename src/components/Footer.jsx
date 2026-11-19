import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, Star } from 'lucide-react'
import { business, services, GOOGLE_PROFILE_URL } from '../lib/siteConfig'
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages'
import './footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__seam" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__brand-row">
            <img src="/images/logo.png" alt={`${business.name} logo`} className="footer__brand-logo" loading="lazy" />
          </div>
          <p>Mobile interior and exterior detailing for Anaheim and the neighborhoods around it. We bring our own water and power.</p>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Packages</p>
          {services.map((s) => (
            <a key={s.id} href="/#services">{s.name} — {s.addOn ? '+' : ''}${s.price}</a>
          ))}
          <Link to="/book">Book Online</Link>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Company</p>
          <a href="/#gallery">Gallery</a>
          <a href="/#reviews">Reviews</a>
          <a href="/#faq">FAQ</a>
          <a href="/#area">Service Area</a>
        </div>

        <div className="footer__col footer__contact">
          <p className="footer__heading">Contact</p>
          <a href={business.phoneHref}><Phone size={15} /> {business.phone}</a>
          <span><MapPin size={15} /> Mobile service in {business.city}</span>
          <span><Clock size={15} /> {business.hours}</span>
          {GOOGLE_PROFILE_URL && (
            <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer"><Star size={15} /> Find us on Google</a>
          )}
        </div>
      </div>

      <div className="container footer__links">
        <nav className="footer__links-row" aria-label="Services">
          <span className="footer__heading">Services</span>
          {SERVICE_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.nav}</Link>)}
        </nav>
        <nav className="footer__links-row" aria-label="Areas we serve">
          <span className="footer__heading">Areas</span>
          <Link to="/">{HOME_CITY}</Link>
          {CITY_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.city}</Link>)}
        </nav>
      </div>

      <div className="container footer__bottom">
        <span>&copy; 2026 {business.fullName}. All rights reserved.</span>
        <span>Mobile car detailing in Anaheim, CA</span>
      </div>
    </footer>
  )
}
