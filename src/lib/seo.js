import { business as BUSINESS, FAQS, SITE_URL, GOOGLE_PROFILE_ID, services as SERVICES } from './siteConfig.js'
import { LANDING_PAGES, CITY_PAGES, HOME_CITY, fitTitle, findLanding } from './pages.js'

// Per-route <head> tags. Used by the browser (<Seo /> in App.jsx) on every
// navigation and by scripts/prerender.js at build time, so both stay identical.

const OG_IMAGE = { src: '/images/hero-tacoma-foam.jpg', w: 1600, h: 739, alt: 'Silver Toyota Tacoma rinsed after an Aventa foam pre-wash' }
const abs = (path) => `${SITE_URL}${path === '/' ? '/' : path}`

const BUSINESS_ID = `${SITE_URL}/#business`
const [basic, premium, EXTERIOR] = SERVICES
function businessNode() {
  return {
    // AutomotiveBusiness, not AutoWash: this is a detailer, and the wash is only an add-on.
    '@type': 'AutomotiveBusiness',
    '@id': BUSINESS_ID,
    name: BUSINESS.fullName,
    url: abs('/'),
    telephone: '+1-714-386-1688',
    image: abs(OG_IMAGE.src),
    logo: abs('/images/logo.png'),
    // Cheapest bookable visit (Basic) to the most complete one (Premium + wash). Never the $50 add-on alone.
    priceRange: `$${basic.price}–$${premium.price + EXTERIOR.price}`,
    // Mobile business based in Anaheim (no storefront): city only.
    address: { '@type': 'PostalAddress', addressLocality: HOME_CITY, addressRegion: 'CA', addressCountry: 'US' },
    areaServed: [HOME_CITY, ...CITY_PAGES.map((c) => c.city)].map((name) => ({ '@type': 'City', name: `${name}, CA` })),
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '19:00',
    }],
    // Google Business Profile link, once there is one (lib/business.js).
    ...(GOOGLE_PROFILE_ID ? { sameAs: [GOOGLE_PROFILE_ID] } : {}),
  }
}

const faqNode = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

const crumbsNode = (page) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
    { '@type': 'ListItem', position: 2, name: page.nav, item: abs(page.path) },
  ],
})

const serviceNode = (page) => ({
  '@type': 'Service',
  name: page.h1.join(' ').replace(/[.,]+$/, ''),
  serviceType: page.service.type,
  url: abs(page.path),
  provider: { '@id': BUSINESS_ID },
  areaServed: { '@type': 'City', name: `${page.city}, CA` },
  offers: page.service.offers.map(([name, price]) => ({ '@type': 'Offer', name, price: String(price), priceCurrency: 'USD' })),
})

const HOME = {
  title: fitTitle('Mobile Car Detailing', HOME_CITY),
  description: 'Mobile car detailing in Anaheim, CA. Interior details from $150, shampoo and extraction for $200, add a $50 hand wash. Satisfaction guaranteed.',
}

const FLOW = {
  '/book': { title: 'Book Mobile Car Detailing in Anaheim | Aventa', description: 'Book mobile car detailing in Anaheim and nearby. Pick a detail, add the optional $50 hand wash, and choose a time from 7 AM to 7 PM.' },
  '/checkout': { title: 'Checkout | Aventa Car Detailing', description: 'Confirm and pay for your Aventa Car Detailing appointment.', noindex: true },
  '/confirmation': { title: 'Booking Confirmed | Aventa Car Detailing', description: 'Your Aventa Car Detailing appointment is booked.', noindex: true },
}

const NOT_FOUND = {
  title: 'Page Not Found | Aventa Car Detailing',
  description: 'This page does not exist. See our mobile detailing packages or book online.',
  noindex: true,
}

// Every route that gets its own prerendered HTML file. `ssr: false` routes ship
// only their head tags; the page itself renders in the browser.
// /404 becomes dist/404.html, which Cloudflare serves (with a 404 status) for unknown URLs.
export const ROUTES = [
  { path: '/', ssr: true, sitemap: true, priority: '1.0' },
  ...LANDING_PAGES.map((p) => ({ path: p.path, ssr: true, sitemap: true, priority: p.kind === 'service' ? '0.9' : '0.8' })),
  { path: '/book', ssr: false, sitemap: true, priority: '0.6' },
  { path: '/checkout', ssr: false, sitemap: false },
  { path: '/confirmation', ssr: false, sitemap: false },
  { path: '/404', ssr: true, sitemap: false },
]

export function pageMeta(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const page = findLanding(path)
  if (page) {
    return {
      title: page.title,
      description: page.description,
      canonical: abs(page.path),
      jsonLd: [businessNode(), serviceNode(page), faqNode(page.faqs), crumbsNode(page)],
    }
  }
  const flow = FLOW[path]
  if (flow) return { ...flow, canonical: abs(path), jsonLd: [] }
  if (path === '/') {
    return {
      ...HOME,
      canonical: abs('/'),
      jsonLd: [
        { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: BUSINESS.fullName, url: abs('/') },
        businessNode(),
        faqNode(FAQS),
      ],
    }
  }
  // Unknown path: the 404 page. noindex, canonical to home.
  return { ...NOT_FOUND, canonical: abs('/'), jsonLd: [] }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Head markup for a route. Every tag carries data-seo so the browser can swap
// the whole set on navigation.
export function headTags(meta) {
  const og = abs(OG_IMAGE.src)
  const tags = [
    `<title data-seo>${esc(meta.title)}</title>`,
    `<meta data-seo name="description" content="${esc(meta.description)}" />`,
    `<link data-seo rel="canonical" href="${esc(meta.canonical)}" />`,
    meta.noindex ? '<meta data-seo name="robots" content="noindex, follow" />' : '',
    '<meta data-seo property="og:type" content="website" />',
    `<meta data-seo property="og:site_name" content="${esc(BUSINESS.fullName)}" />`,
    '<meta data-seo property="og:locale" content="en_US" />',
    `<meta data-seo property="og:url" content="${esc(meta.canonical)}" />`,
    `<meta data-seo property="og:title" content="${esc(meta.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(meta.description)}" />`,
    `<meta data-seo property="og:image" content="${og}" />`,
    `<meta data-seo property="og:image:width" content="${OG_IMAGE.w}" />`,
    `<meta data-seo property="og:image:height" content="${OG_IMAGE.h}" />`,
    `<meta data-seo property="og:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
    '<meta data-seo name="twitter:card" content="summary_large_image" />',
    `<meta data-seo name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta data-seo name="twitter:image" content="${og}" />`,
  ]
  if (meta.jsonLd.length) {
    const graph = JSON.stringify({ '@context': 'https://schema.org', '@graph': meta.jsonLd }).replace(/</g, '\\u003c')
    tags.push(`<script data-seo type="application/ld+json">${graph}</script>`)
  }
  return tags.filter(Boolean).join('\n    ')
}

// Browser: replace the current data-seo tags with the ones for `pathname`.
export function applyHead(pathname) {
  const meta = pageMeta(pathname)
  const current = document.querySelector('link[data-seo][rel="canonical"]')?.getAttribute('href')
  if (current === meta.canonical && document.title === meta.title) return
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  const tpl = document.createElement('template')
  tpl.innerHTML = headTags(meta)
  document.head.append(...tpl.content.childNodes)
  document.title = meta.title
}
