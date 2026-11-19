import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, ShieldCheck } from 'lucide-react'
import { business } from '../lib/siteConfig'
import './hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__copy">
        <div className="container hero__copy-inner">
          <h1 className="eyebrow-mark">Mobile car detailing in Anaheim, CA</h1>
          <p className="hero__headline">
            Detailing that treats your car like it just left the showroom.
          </p>
          <p className="hero__sub">
            Hand-finished interior detailing, plus an optional hand wash, at your home in
            Anaheim. We bring our own water and power; you book online.
          </p>
          <div className="hero__actions">
            <Link to="/book" className="btn btn-primary">Book Online</Link>
            <a href={business.phoneHref} className="btn btn-outline hero__call">
              <Phone size={16} /> {business.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero__visual-frame">
          <img
            src="/images/hero-tacoma-foam.jpg"
            alt="Silver Toyota Tacoma rinsed after a foam pre-wash"
            width="1600"
            height="739"
            fetchpriority="high"
            className="hero__img hero__img--desktop"
          />
        </div>
        <div className="hero__badge" aria-hidden="true">
          <ShieldCheck size={22} />
          <span>Satisfaction<br/>Guaranteed</span>
        </div>
      </div>
    </section>
  )
}
