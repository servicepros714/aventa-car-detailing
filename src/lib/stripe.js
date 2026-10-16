import { loadStripe } from '@stripe/stripe-js'
import { PREPAY_COUPON } from './siteConfig'

let stripePromise
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

const API_URL = import.meta.env.VITE_API_URL

/**
 * Asks the Worker to create a PaymentIntent for an existing booking. The Worker
 * charges the booking's server-computed total (the coupon is re-checked there)
 * and sets automatic_payment_methods[enabled]=true so Link / Apple Pay /
 * Google Pay all work without listing payment_method_types.
 */
export async function createPaymentIntent({ bookingId, coupon }) {
  const res = await fetch(`${API_URL}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, coupon }),
  })
  if (!res.ok) throw new Error('Could not start checkout. Please try again.')
  return res.json() // { clientSecret }
}

export function priceWithCoupon(subtotal, couponApplied) {
  return couponApplied ? Math.max(0, subtotal - PREPAY_COUPON.amountOff) : subtotal
}
