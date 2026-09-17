import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone, CalendarCheck } from 'lucide-react'
import { business } from '../lib/siteConfig'
import './mobileActionBar.css'

const HIDDEN_PREFIXES = ['/book', '/checkout', '/confirmation']

export default function MobileActionBar() {
  const { pathname } = useLocation()
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null

  return (
    <div className="mobile-bar" role="navigation" aria-label="Quick actions">
      <a href={business.phoneHref} className="mobile-bar__btn mobile-bar__btn--call">
        <Phone size={18} /> Call Now
      </a>
      <Link to="/book" className="mobile-bar__btn mobile-bar__btn--book">
        <CalendarCheck size={18} /> Book Online
      </Link>
    </div>
  )
}
