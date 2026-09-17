import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useBooking } from '../lib/BookingContext'
import { services } from '../lib/siteConfig'
import { isValidEmail, isValidPhone } from '../lib/format'
import StepBar from '../components/StepBar'
import StickyStepActions from '../components/StickyStepActions'
import ServiceStep from './steps/ServiceStep'
import ExteriorAddOnStep from './steps/ExteriorAddOnStep'
import DateStep from './steps/DateStep'
import TimeStep from './steps/TimeStep'
import InfoStep from './steps/InfoStep'
import './bookingPage.css'

export default function Book() {
  const [step, setStep] = useState(1)
  const [serviceSubStep, setServiceSubStep] = useState('package') // 'package' | 'exterior'
  const [errors, setErrors] = useState({})
  const { booking, updateBooking } = useBooking()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const preselect = params.get('service')
    if (preselect && services.some((s) => s.id === preselect && !s.addOn)) {
      updateBooking({ serviceId: preselect })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedService = useMemo(() => services.find((s) => s.id === booking.serviceId), [booking.serviceId])
  const exteriorAddOn = useMemo(() => services.find((s) => s.addOn), [])
  const total = (selectedService?.price || 0) + (booking.addExterior ? exteriorAddOn.price : 0)

  const validateInfo = () => {
    const e = {}
    if (!booking.fullName.trim()) e.fullName = 'Enter your full name.'
    if (!isValidPhone(booking.phone)) e.phone = 'Enter a valid 10-digit phone number.'
    if (!isValidEmail(booking.email)) e.email = 'Enter a valid email address.'
    if (!booking.address.trim()) e.address = 'Enter the service address.'
    if (!booking.vehicle.trim()) e.vehicle = 'Enter your vehicle year, make, and model.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const canAdvance = () => {
    if (step === 1 && serviceSubStep === 'package') return !!booking.serviceId
    if (step === 2) return !!booking.date
    if (step === 3) return !!booking.time
    return true
  }

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error(
        step === 1 ? 'Select a service to continue.' :
        step === 2 ? 'Select a date to continue.' :
        'Select a time to continue.'
      )
      return
    }

    if (step === 1 && serviceSubStep === 'package') {
      setServiceSubStep('exterior')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step < 4) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (!validateInfo()) {
      toast.error('Please fix the highlighted fields.')
      return
    }
    navigate('/checkout')
  }

  const handleBack = () => {
    if (step === 1 && serviceSubStep === 'exterior') {
      setServiceSubStep('package')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (step === 1) { navigate(-1); return }
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepTitles = {
    1: serviceSubStep === 'package'
      ? { title: 'Choose your service', sub: 'Pick a detail package that fits your car.' }
      : { title: 'Add an exterior wash?', sub: 'Optional — add a full hand wash & shine to your detail. Leave it off to continue with interior only.' },
    2: { title: 'Pick a date', sub: 'Choose the day that works best for you.' },
    3: { title: 'Pick a time', sub: 'Times shown are already booked for the selected date.' },
    4: { title: 'Your info', sub: 'Last step — tell us where to find you and your vehicle.' },
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className={`booking-page__head ${(step === 1 && serviceSubStep === 'exterior') || step === 2 ? 'booking-page__head--center' : ''}`}>
          <h1>{stepTitles[step].title}</h1>
          <p>{stepTitles[step].sub}</p>
        </div>

        <StepBar current={step} />

        <div className="booking-card">
          {step === 1 && serviceSubStep === 'package' && <ServiceStep booking={booking} updateBooking={updateBooking} />}
          {step === 1 && serviceSubStep === 'exterior' && <ExteriorAddOnStep booking={booking} updateBooking={updateBooking} />}
          {step === 2 && <DateStep booking={booking} updateBooking={updateBooking} />}
          {step === 3 && <TimeStep booking={booking} updateBooking={updateBooking} />}
          {step === 4 && <InfoStep booking={booking} updateBooking={updateBooking} errors={errors} />}

          {selectedService && (
            <div className="booking-summary">
              <div className="booking-summary__row">
                <span>{selectedService.name}</span><strong>${selectedService.price}</strong>
              </div>
              {booking.addExterior && (
                <div className="booking-summary__row">
                  <span>{exteriorAddOn.name}</span><strong>+${exteriorAddOn.price}</strong>
                </div>
              )}
              {booking.date && (
                <div className="booking-summary__row">
                  <span>Scheduled</span><strong>{booking.dateLabel}{booking.time ? ` · ${booking.time}` : ''}</strong>
                </div>
              )}
              <div className="booking-summary__row booking-summary__total">
                <span>Total</span><span>${total}</span>
              </div>
            </div>
          )}
        </div>

        <StickyStepActions
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={step === 4 ? 'Continue to Checkout' : 'Continue'}
          backLabel={step === 1 && serviceSubStep === 'exterior' ? 'Back' : 'Back'}
        />
      </div>
    </div>
  )
}
