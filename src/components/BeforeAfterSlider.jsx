import React, { useCallback, useRef, useState } from 'react'
import './beforeAfterSlider.css'

export default function BeforeAfterSlider({ before, after, label }) {
  const [position, setPosition] = useState(50)
  const trackRef = useRef(null)
  const dragging = useRef(false)

  const setFromClientX = useCallback((clientX) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  const onDown = (e) => {
    dragging.current = true
    setFromClientX(e.touches ? e.touches[0].clientX : e.clientX)
  }
  const onMove = (e) => {
    if (!dragging.current) return
    setFromClientX(e.touches ? e.touches[0].clientX : e.clientX)
  }
  const onUp = () => { dragging.current = false }

  return (
    <div
      ref={trackRef}
      className="ba-slider"
      style={{ touchAction: 'pan-y' }}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
    >
      {label && <span className="ba-slider__label">{label}</span>}
      <img src={before} alt="Before detailing" className="ba-slider__img ba-slider__img--before" draggable={false} />
      <div className="ba-slider__after-wrap" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <img src={after} alt="After detailing" className="ba-slider__img ba-slider__img--after" draggable={false} />
      </div>
      <div className="ba-slider__handle" style={{ left: `${position}%` }}>
        <div className="ba-slider__grip">
          <span>&#10094;</span><span>&#10095;</span>
        </div>
      </div>
      <span className="ba-slider__tag ba-slider__tag--before">Before</span>
      <span className="ba-slider__tag ba-slider__tag--after">After</span>
    </div>
  )
}
