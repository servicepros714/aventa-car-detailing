import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import './stickyStepActions.css'

export default function StickyStepActions({ onBack, onNext, nextLabel = 'Continue', nextDisabled, backLabel = 'Back', showBack = true }) {
  return (
    <div className="step-actions">
      <div className="step-actions__inner container">
        {showBack ? (
          <button className="btn btn-outline step-actions__back" onClick={onBack} type="button">
            <ArrowLeft size={16} /> {backLabel}
          </button>
        ) : <span />}
        <button className="btn btn-primary step-actions__next" onClick={onNext} disabled={nextDisabled} type="button">
          {nextLabel} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
