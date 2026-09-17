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
            label="Full interior detail"
          />
          <BeforeAfterSlider
            before="/images/ford-before.jpg"
            after="/images/ford-after.jpg"
            label="Interior refresh"
          />
          <div className="gallery__photo">
            <img src="/images/gallery-truck-black.jpg" alt="Freshly detailed black GMC Denali truck, glossy exterior finish" />
          </div>
          <div className="gallery__photo">
            <img src="/images/gallery-infiniti-foam.jpg" alt="Infiniti sedan being pre-washed with snow foam" />
          </div>
        </div>
      </div>
    </section>
  )
}
