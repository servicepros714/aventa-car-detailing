// Aventa Car Detailing — site configuration
// Update WORKER_URL and STRIPE keys once infrastructure is provisioned.

export const business = {
  name: 'Aventa Car Detailing',
  tagline: 'Premium Auto Care',
  city: 'Anaheim, CA',
  phone: '(714) 386-1688',
  phoneHref: 'tel:+17143861688',
  email: 'hello@aventacardetailing.com',
  address: 'Anaheim, CA',
  hours: 'Mon–Sun, By Appointment',
  instagram: 'https://instagram.com/aventacardetailing',
  facebook: 'https://facebook.com/aventacardetailing',
}

// Source-scoping — must stay unique across the whole Service Pros portfolio.
// "premium-anaheim" is already used by Premium Detailing Solutions (Anaheim),
// so Aventa (a separate business, same city) gets its own tag/prefix.
export const SOURCE_TAG = 'aventa-anaheim'
export const BOOKING_PREFIX = 'AVT-'

export const services = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
    description: 'A thorough interior refresh for everyday upkeep.',
    features: [
      'Triple-Stage Vacuuming for Deep Debris Removal',
      'Complete Interior Surface Wipe-Down',
      'Floor Mat Cleaning & Restoration',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Interior Detail',
    price: 200,
    description: 'Our most complete interior treatment, top to bottom.',
    featured: true,
    features: [
      'Triple-Stage Vacuuming',
      'Cabin Application',
      'Dust Elimination',
      'Interior Window Cleaning',
      'Deep Carpet Cleaning',
      'Cloth & Carpet Extraction',
      'Full Interior Shampooing',
      'UV-Protectant Coating',
    ],
  },
  {
    id: 'exterior',
    name: 'Exterior Wash',
    price: 50,
    addOn: true,
    description: 'Add a hand-finished exterior to either detail package.',
    features: [
      'Hand-Washed Exterior',
      'Detailed Rim Cleaning',
      'Tire Scrub and Degrease',
      'Door Jamb & Panel Wipe-Down',
      'Premium Tire Shine Application',
      'Spot-Free Hand Drying',
    ],
  },
]

export const PREPAY_COUPON = { code: 'PREPAY', amountOff: 15 }
