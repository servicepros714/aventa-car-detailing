import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react'
import { business } from '../lib/siteConfig'
import './footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__seam" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__brand-row">
            <img src="/images/logo.png" alt={`${business.name} logo`} className="footer__brand-logo" />
          </div>
          <p>Premium interior & exterior detailing for Anaheim and the surrounding area. Careful, thorough, and built around your schedule.</p>
          <div className="footer__social">
            <a href={business.instagram} aria-label="Aventa on Instagram"><Instagram size={18} /></a>
            <a href={business.facebook} aria-label="Aventa on Facebook"><Facebook size={18} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Services</h4>
          <a href="/#services">Basic Detail</a>
          <a href="/#services">Premium Detail</a>
          <a href="/#services">Exterior Wash</a>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <a href="/#gallery">Gallery</a>
          <a href="/#reviews">Reviews</a>
          <Link to="/book">Book Online</Link>
        </div>

        <div className="footer__col footer__contact">
          <h4>Contact</h4>
          <a href={business.phoneHref}><Phone size={15} /> {business.phone}</a>
          <a href={`mailto:${business.email}`}><Mail size={15} /> {business.email}</a>
          <span><MapPin size={15} /> {business.address}</span>
          <span><Clock size={15} /> {business.hours}</span>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>&copy; {new Date().getFullYear()} {business.name}. All rights reserved.</span>
        <span>Serving Anaheim, CA</span>
      </div>
    </footer>
  )
}
