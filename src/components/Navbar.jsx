import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { business } from '../lib/siteConfig'
import './navbar.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/#services', label: 'Services' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/#reviews', label: 'Reviews' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <nav className="nav__links nav__links--left" aria-label="Primary">
          {links.slice(0, 2).map((l) => (
            <a key={l.label} href={l.to} className="nav__link">{l.label}</a>
          ))}
        </nav>

        <Link to="/" className="nav__brand" aria-label={`${business.name} home`}>
          <img src="/images/logo.png" alt={`${business.name} logo`} className="nav__brand-logo" />
        </Link>

        <nav className="nav__links nav__links--right" aria-label="Secondary">
          {links.slice(2).map((l) => (
            <a key={l.label} href={l.to} className="nav__link">{l.label}</a>
          ))}
          <a href={business.phoneHref} className="nav__phone">
            <Phone size={15} /> {business.phone}
          </a>
          <Link to="/book" className="btn btn-primary nav__cta">Book Online</Link>
        </nav>

        <button className="nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="nav__sheet">
          {links.map((l) => (
            <a key={l.label} href={l.to} className="nav__sheet-link">{l.label}</a>
          ))}
          <a href={business.phoneHref} className="nav__sheet-link nav__sheet-link--phone">
            <Phone size={16} /> {business.phone}
          </a>
          <Link to="/book" className="btn btn-primary btn-block">Book Online</Link>
        </div>
      )}
    </header>
  )
}
