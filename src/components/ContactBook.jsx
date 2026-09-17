import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { business } from '../lib/siteConfig'
import './contactBook.css'

export default function ContactBook() {
  return (
    <section id="contact" className="section contact-book">
      <div className="container contact-book__grid">
        <div>
          <span className="eyebrow-mark">Get In Touch</span>
          <h2>Serving Anaheim and the surrounding area</h2>
          <p className="contact-book__lead">Questions about a package, or need a time that's not listed online? Call or text and we'll sort it out.</p>
          <div className="contact-book__list">
            <a href={business.phoneHref}><Phone size={17} /> {business.phone}</a>
            <a href={`mailto:${business.email}`}><Mail size={17} /> {business.email}</a>
            <span><MapPin size={17} /> {business.address}</span>
            <span><Clock size={17} /> {business.hours}</span>
          </div>
        </div>

        <div className="quick-book">
          <span className="quick-book__eyebrow">Ready when you are</span>
          <h3>Book your detail</h3>
          <p>Pick a package, date, and time — takes under two minutes.</p>
          <ul className="quick-book__list">
            <li>Basic Detail <span>$150</span></li>
            <li>Premium Detail <span>$200</span></li>
            <li>Exterior Wash <span>+$50</span></li>
          </ul>
          <Link to="/book" className="btn btn-primary btn-block quick-book__btn">
            Book Online <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
