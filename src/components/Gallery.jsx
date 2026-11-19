import React from 'react'
import BeforeAfterSlider from './BeforeAfterSlider'
import './gallery.css'

export default function Gallery() {
  return (
    <section id="gallery" className="section section--dark gallery">
      <div className="container">
        <span className="eyebrow-mark">Recent Work</span>
        <h2 className="gallery__title">See the difference, drag to compare</h2>
        <div className="gallery__grid">
          <BeforeAfterSlider
            before="/images/interior-before.jpg"
            after="/images/interior-after.jpg"
            label="Honda interior"
            alt="Honda front seats and carpet"
          />
          <BeforeAfterSlider
            before="/images/ford-before.jpg"
            after="/images/ford-after.jpg"
            label="Ford truck interior"
            alt="Ford pickup dashboard and floor"
          />
          <div className="gallery__photo">
            <img src="/images/gallery-truck-black.jpg" alt="Black GMC Sierra Denali pickup with a glossy finish after a detail" width="1600" height="739" loading="lazy" />
          </div>
          <div className="gallery__photo">
            <img src="/images/gallery-infiniti-foam.jpg" alt="Infiniti coupe covered in snow foam during a hand wash" width="1800" height="831" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
