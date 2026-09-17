import React from 'react'
import { Check } from 'lucide-react'
import './stepBar.css'

const STEPS = ['Service', 'Date', 'Time', 'Your Info']

export default function StepBar({ current }) {
  return (
    <div className="stepbar">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const state = stepNum < current ? 'done' : stepNum === current ? 'active' : 'upcoming'
        return (
          <React.Fragment key={label}>
            <div className={`stepbar__item stepbar__item--${state}`}>
              <span className="stepbar__dot">{state === 'done' ? <Check size={13} /> : stepNum}</span>
              <span className="stepbar__label">{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`stepbar__rule ${stepNum < current ? 'stepbar__rule--done' : ''}`} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}
