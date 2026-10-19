import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'
import { Tag, Check } from 'lucide-react'
import { useBooking } from '../lib/BookingContext'
import { services, PREPAY_COUPON } from '../lib/siteConfig'
import { createBooking, confirmPayLater } from '../lib/bookingDb'
import { getStripe, createPaymentIntent, priceWithCoupon } from '../lib/stripe'
import CheckoutForm from './CheckoutForm'
import './checkout.css'

export default function Checkout() {
  const { booking, updateBooking, resetBooking } = useBooking()
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')
  const [clientSecret, setClientSecret] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [submittingPayLater, setSubmittingPayLater] = useState(false)

  const selectedService = useMemo(() => services.find((s) => s.id === booking.serviceId), [booking.serviceId])
  const exteriorAddOn = useMemo(() => services.find((s) => s.addOn), [])

  useEffect(() => {
    if (!booking.serviceId || !booking.date || !booking.time || !booking.fullName) {
      navigate('/book')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const subtotal = (selectedService?.price || 0) + (booking.addExterior ? exteriorAddOn.price : 0)
  const total = priceWithCoupon(subtotal, booking.couponApplied)

  // The booking is saved once (as 'Pay Later') before any payment is taken, so the
  // PaymentIntent can carry its id and the Stripe webhook can mark it Paid.
  const bookingPromise = useRef(null)
  const ensureBooking = () => {
    if (!bookingPromise.current) {
      bookingPromise.current = createBooking({
        date: booking.date,
        time: booking.time,
        serviceId: booking.serviceId,
        exteriorAddOn: booking.addExterior,
        coupon: booking.couponApplied ? PREPAY_COUPON.code : null,
        name: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        vehicle: booking.vehicle,
        address: booking.address,
        notes: booking.notes,
        replaceId: booking.draftBookingId,
      }).then((created) => {
        updateBooking({ draftBookingId: created.id })
        return created
      }).catch((err) => {
        bookingPromise.current = null
        // 4xx messages (slot taken, booking limit, invalid time) come from the Worker and are customer-facing.
        toast.error(err.status >= 400 && err.status < 500 ? err.message : 'We could not save your booking. Please try again or call us.')
        throw err
      })
    }
    return bookingPromise.current
  }

  useEffect(() => {
    if (!selectedService) return
    let cancelled = false
    setClientSecret(null)
    ensureBooking()
      .then((created) => createPaymentIntent({
        bookingId: created.id,
        coupon: booking.couponApplied ? PREPAY_COUPON.code : null,
      }).catch((err) => {
        toast.error('Could not start checkout. Please refresh and try again.')
        throw err
      }))
      .then((res) => { if (!cancelled) setClientSecret(res.clientSecret) })
      .catch(() => {})
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.couponApplied])

  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === PREPAY_COUPON.code) {
      updateBooking({ couponApplied: true })
      toast.success(`${PREPAY_COUPON.code} applied — $${PREPAY_COUPON.amountOff} off`)
    } else {
      toast.error('That code is not valid.')
    }
  }

  // Payment status is set to 'Paid' by the Stripe webhook, not by the browser.
  const handlePaymentSuccess = async () => {
    try {
      const created = await ensureBooking()
      toast.success('Payment confirmed — booking locked in!')
      navigate(`/confirmation?id=${created.id}`, { state: { details: created } })
      resetBooking()
    } catch {
      // toast already shown
    }
  }

  const handlePayLater = async () => {
    setSubmittingPayLater(true)
    try {
      const created = await ensureBooking()
      // Confirming turns the 'Pending' draft into a Confirmed / Pay Later booking (and notifies GHL).
      await confirmPayLater(created.id, booking.email).catch((err) => {
        toast.error('We could not confirm your booking. Please try again or call us.')
        throw err
      })
      toast.success('Booking confirmed — pay at appointment.')
      navigate(`/confirmation?id=${created.id}`, { state: { details: created } })
      resetBooking()
    } catch {
      // toast already shown
    } finally {
      setSubmittingPayLater(false)
    }
  }

  if (!selectedService) return null

  return (
    <div className="checkout-page">
      <div className="container checkout-page__grid">
        <div className="booking-card checkout-page__form">
          <h1>Checkout</h1>
          <p className="checkout-page__lead">Secure payment powered by Stripe. Prefer to pay in person? Choose Pay Later below.</p>

          <div className="checkout-coupon">
            <div className="checkout-coupon__input">
              <Tag size={16} />
              <input
                type="text"
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={booking.couponApplied}
              />
            </div>
            <button type="button" className="btn btn-outline" onClick={applyCoupon} disabled={booking.couponApplied}>
              {booking.couponApplied ? <><Check size={15} /> Applied</> : 'Apply'}
            </button>
          </div>

          {clientSecret ? (
            <Elements key={clientSecret} stripe={getStripe()} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm
                clientSecret={clientSecret}
                billingDetails={{ name: booking.fullName, email: booking.email, phone: booking.phone }}
                onSuccess={handlePaymentSuccess}
                processing={processing}
                setProcessing={setProcessing}
              />
            </Elements>
          ) : (
            <div className="checkout-form__loading">Loading secure payment form…</div>
          )}

          {/* One click, like the rest of the portfolio: confirms the booking and pays at the appointment. */}
          <div className="checkout-paylater">
            <div className="checkout-form__divider"><span>Or</span></div>
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={handlePayLater}
              disabled={submittingPayLater || processing}
            >
              {submittingPayLater ? 'Confirming…' : "I'll Pay Later — Confirm Booking"}
            </button>
            <p>No payment now — we'll collect payment at your appointment.</p>
          </div>
        </div>

        <aside className="checkout-page__summary">
          <h2>Order Summary</h2>
          <div className="price-bar">
            <div className="price-bar__row"><span>{selectedService.name}</span><span>${selectedService.price}</span></div>
            {booking.addExterior && (
              <div className="price-bar__row"><span>{exteriorAddOn.name}</span><span>+${exteriorAddOn.price}</span></div>
            )}
            {booking.couponApplied && (
              <div className="price-bar__row price-bar__row--discount"><span>{PREPAY_COUPON.code} discount</span><span>-${PREPAY_COUPON.amountOff}</span></div>
            )}
            <div className="price-bar__total"><span>Total</span><span>${total}</span></div>
          </div>
          <div className="checkout-page__appt">
            <strong>{booking.dateLabel}</strong>
            <span>{booking.time}</span>
            <span>{booking.vehicle}</span>
            <span>{booking.address}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
