// Aventa Car Detailing — site configuration.
// Used by the pages, the SEO head tags / schema (src/lib/seo.js) and the booking flow.
//
// Confirmed by the owner (Nov 2026): mobile only (we come to you), same price for every
// vehicle size, own water and power, satisfaction guaranteed, job times as listed,
// open 7 days 7 AM – 7 PM. NOT confirmed, so never state: a shop, years in business,
// ratings, number of cars detailed, insurance, same-week availability, text alerts.
// (The old hello@aventacardetailing.com address and social links were removed: the
// domain doesn't exist and the social pages weren't confirmed.)

export const business = {
  name: 'Aventa Car Detailing',
  fullName: 'Aventa Car Detailing Anaheim',
  tagline: 'Premium Auto Care',
  city: 'Anaheim, CA',
  phone: '(714) 386-1688',
  phoneHref: 'tel:+17143861688',
  address: 'Anaheim, CA',
  hours: 'Open 7 days, 7 AM – 7 PM',
}

export const HOURS = business.hours

// Canonical site address (no www). Every canonical tag, sitemap URL and schema URL uses this.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://aventacardetailinganaheim.site').replace(/\/$/, '')

// Google Business Profile. GOOGLE_PROFILE_URL is the share link people click;
// GOOGLE_PROFILE_ID is the stable kgmid search URL used in schema (sameAs).
export const GOOGLE_PROFILE_URL = 'https://share.google/3u66GEZemBKm2EGua'
export const GOOGLE_PROFILE_ID = 'https://www.google.com/search?kgmid=/g/11yrbvh09l'

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
    duration: '2–3 hours',
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
    duration: '3–5 hours',
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
    duration: 'adds 1–2 hours',
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

// Home page FAQ. Also used for the FAQPage schema on the home page, so only list
// questions that are shown on the page, and only confirmed facts.
export const FAQS = [
  { q: 'Do you come to my place?', a: 'Yes. Aventa is fully mobile: we detail your car at your home or office in Anaheim and nearby. Enter your address when you book.' },
  { q: 'Do I need to provide water or power?', a: 'No. We bring our own water, power and supplies. We just need room to open every door.' },
  { q: 'What does a detail cost?', a: 'The Basic Detail is $150 and the Premium Interior Detail is $200. Add the Exterior Wash to either one for $50.' },
  { q: 'Can I book just a wash?', a: 'No. The Exterior Wash is an add-on. Choose the Basic Detail or the Premium Interior Detail, then add the wash.' },
  { q: 'Do bigger vehicles cost more?', a: 'No. Sedans, SUVs, trucks and vans all pay the same package price.' },
  { q: 'How long will it take?', a: 'About 2–3 hours for the Basic Detail and 3–5 hours for the Premium Interior Detail. The Exterior Wash adds about 1–2 hours.' },
  { q: 'What if I’m not satisfied?', a: 'Tell us. Every detail comes with our satisfaction guarantee, and we’ll make it right.' },
  { q: 'When can I book, and how do I pay?', a: 'Any day, with start times every 30 minutes from 7 AM to 7 PM. Prepay online with code PREPAY to save $15, or pay after the detail.' },
]

// Real customer reviews only, copied from the Google Business Profile
// (first name + last initial, spelling typos fixed). While empty, the Reviews section
// links to the Google profile. To add one: { name: 'Maria G.', text: '...' }.
export const REVIEWS = [
  { name: 'Itzel F.', text: 'Amazing job definitely worth it and definitely coming back!' },
  { name: 'Jorge F.', text: 'The interior cleaning was spot on! Such a good service and very recommended' },
  { name: 'Joel D.', text: 'The staff is really helpful!' },
  { name: 'Eliseo E.', text: 'Great customer service and time accurate.' },
]
