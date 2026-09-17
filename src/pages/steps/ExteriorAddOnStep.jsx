import React from 'react'
import { services } from '../../lib/siteConfig'

const exteriorAddOn = services.find((s) => s.addOn)

export default function ExteriorAddOnStep({ booking, updateBooking }) {
  const selectedService = services.find((s) => s.id === booking.serviceId)

  return (
    <div className="step-exterior">
      <div className={`step-service__addon step-exterior__row ${booking.addExterior ? 'step-service__addon--active' : ''}`}>
        <span className="step-service__addon-icon">💧</span>
        <div className="step-service__addon-info">
          <strong>Add {exteriorAddOn.name} (+${exteriorAddOn.price})</strong>
          <span>Hand wash, wheels, tires, and panel wipe-down.</span>
        </div>
        <button
          type="button"
          className={`toggle ${booking.addExterior ? 'toggle--on' : ''}`}
          aria-pressed={booking.addExterior}
          aria-label="Add exterior wash"
          onClick={() => updateBooking({ addExterior: !booking.addExterior })}
        />
      </div>

      {selectedService && (
        <p className="step-exterior__note">
          Leave it off to continue with {selectedService.name.replace(' Interior Detail', ' Interior')} only.
        </p>
      )}
    </div>
  )
}
