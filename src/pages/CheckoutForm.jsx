import React, { useState } from 'react'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'

const elementStyle = {
  style: {
    base: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: '15px',
      color: '#1D2430',
      '::placeholder': { color: '#9AA5B1' },
    },
    invalid: { color: '#C24444' },
  },
}

export default function CheckoutForm({ clientSecret, onSuccess, processing, setProcessing }) {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState('')

  const handleExpressConfirm = async () => {
    if (!stripe || !elements) return
    setProcessing(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    setProcessing(false)
    if (error) {
      toast.error(error.message || 'Payment failed. Please try again.')
      return
    }
    onSuccess()
  }

  const handleCardSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setCardError('')
    setProcessing(true)

    const cardNumberElement = elements.getElement(CardNumberElement)
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardNumberElement },
    })

    setProcessing(false)
    if (error) {
      setCardError(error.message || 'Your card could not be processed.')
      return
    }
    if (paymentIntent?.status === 'succeeded') {
      onSuccess()
    }
  }

  return (
    <div className="checkout-form">
      <div className="checkout-form__express">
        <ExpressCheckoutElement onConfirm={handleExpressConfirm} />
      </div>

      <div className="checkout-form__divider"><span>Or pay with card</span></div>

      <form onSubmit={handleCardSubmit} className="checkout-form__card">
        <div className="field field--full">
          <label>Card Number</label>
          <div className="stripe-input"><CardNumberElement options={elementStyle} /></div>
        </div>
        <div className="field">
          <label>Expiry</label>
          <div className="stripe-input"><CardExpiryElement options={elementStyle} /></div>
        </div>
        <div className="field">
          <label>CVC</label>
          <div className="stripe-input"><CardCvcElement options={elementStyle} /></div>
        </div>
        {cardError && <div className="field-error field--full">{cardError}</div>}
        <button type="submit" className="btn btn-primary btn-block field--full" disabled={!stripe || processing}>
          {processing ? 'Processing…' : 'Pay & Confirm Booking'}
        </button>
      </form>
    </div>
  )
}
