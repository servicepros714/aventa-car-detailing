// ---------------------------------------------------------------------------
// SEO landing pages (service + city). One template renders all of them
// (src/pages/Landing.jsx); head tags and schema come from src/lib/seo.js.
//
// Only confirmed facts: prices, package contents and job times (siteConfig.js services),
// mobile (we come to you), own water and power, same price for every vehicle size,
// satisfaction guarantee, open 7 days 7 AM – 7 PM, prepay online (PREPAY = $15 off) or
// pay later. Never state: a shop, years, ratings, counts, insurance, text alerts.
// The Exterior Wash is an add-on: never bookable on its own.
// Same owner as Luna Glow and Precision Coat (also Anaheim, with /interior-car-detailing-
// anaheim style pages) and Vetra/Imperial/Alera nearby: Aventa uses different slugs,
// angles and cities none of them cover.
// ---------------------------------------------------------------------------

const BRANDS = ['Aventa Car Detailing', 'Aventa Detailing', 'Aventa'];

// Longest title that fits in 60 chars (counting '&' as the escaped '&amp;').
// Keep ", CA" before the long brand name, then drop ", CA" if nothing fits.
export function fitTitle(keyword, city) {
  const options = [
    ...BRANDS.map((b) => `${keyword} ${city}, CA | ${b}`),
    ...BRANDS.map((b) => `${keyword} ${city} | ${b}`),
  ];
  const len = (t) => t.replace(/&/g, '&amp;').length;
  return options.find((t) => len(t) <= 60) || options[options.length - 1];
}

export const HOME_CITY = 'Anaheim';

const FAQ_WATER = { q: 'Do I need to provide water or power?', a: 'No. We bring our own water, power and supplies. We just need room to open every door.' };
const FAQ_PAY = { q: 'How do I pay?', a: 'Prepay online at checkout and save $15 with code PREPAY, or choose Pay Later and pay after the detail.' };
const FAQ_WASH = { q: 'Can I book just the Exterior Wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic Detail or the Premium Interior Detail.' };
const FAQ_TIME = { q: 'How long will it take?', a: 'About 2–3 hours for the Basic Detail and 3–5 hours for the Premium Interior Detail. The Exterior Wash adds about 1–2 hours.' };
const FAQ_GUARANTEE = { q: 'What if I’m not satisfied?', a: 'Tell us. Every detail comes with our satisfaction guarantee, and we’ll make it right.' };
const FAQ_PACKAGES = {
  q: 'What’s in each package?',
  a: 'Basic Detail ($150): triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning. Premium Interior Detail ($200): adds cabin application, dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating. The Exterior Wash is a $50 add-on to either one.',
};

// Schema offers: only things a customer can actually book. The wash never appears alone.
const DETAIL_OFFERS = [
  ['Basic Detail', 150], ['Premium Interior Detail', 200],
  ['Basic Detail + Exterior Wash', 200], ['Premium Interior Detail + Exterior Wash', 250],
];

// Real job photos (public/images).
const PHOTO = {
  tacoma: { src: '/images/hero-tacoma-foam.jpg', alt: 'Silver Toyota Tacoma rinsed after a foam pre-wash', w: 1600, h: 739 },
  denali: { src: '/images/gallery-truck-black.jpg', alt: 'Black GMC Sierra Denali pickup with a glossy finish after a detail', w: 1600, h: 739 },
  infiniti: { src: '/images/gallery-infiniti-foam.jpg', alt: 'Infiniti coupe covered in snow foam during a hand wash', w: 1800, h: 831 },
  honda: { src: '/images/interior-after.jpg', alt: 'Clean Honda front seats and carpet after an interior detail', w: 900, h: 1213 },
  ford: { src: '/images/ford-after.jpg', alt: 'Ford pickup dashboard and floor after an interior detail', w: 540, h: 801 },
};

export const SERVICE_PAGES = [
  {
    path: '/at-home-car-detailing-anaheim',
    kind: 'service',
    nav: 'At-home detailing',
    city: HOME_CITY,
    title: fitTitle('At-Home Car Detailing', HOME_CITY),
    description: 'At-home car detailing in Anaheim, CA. Basic Detail $150 or Premium Interior Detail $200 with shampoo and extraction, done in your driveway.',
    eyebrow: 'At-home detailing · Anaheim, CA',
    h1: ['At-home car detailing', 'in Anaheim.'],
    lede: 'Your car gets detailed where it’s parked. About 2–3 hours for the Basic Detail, 3–5 for the Premium Interior Detail.',
    facts: ['From $150', 'Same price, any size', 'Satisfaction guaranteed'],
    card: 'premium',
    photo: PHOTO.honda,
    intro: {
      h2: 'Stay home. The detail comes to you.',
      paras: [
        'No drop-off, no ride back, no afternoon in a waiting room: we park next to your car and get to work while you get on with your day.',
        'Basic Detail (about 2–3 hours): triple-stage vacuuming for deep debris removal, a complete interior surface wipe-down, and floor mat cleaning and restoration.',
        'Premium Interior Detail (about 3–5 hours): adds cabin application, dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
      ],
    },
    points: [
      { title: 'Nothing to set up', text: 'We bring our own water, power and supplies.' },
      { title: 'Book any day', text: 'Start times every 30 minutes, 7 AM to 7 PM.' },
      { title: 'Guaranteed', text: 'Not satisfied? Tell us and we’ll make it right.' },
    ],
    faqs: [
      { q: 'Where do you park during the detail?', a: 'Next to your car, in the driveway or at the curb. We need room to open every door; if parking is tight, call us before the appointment.' },
      { q: 'Can you wash the outside too?', a: 'Yes. Add the Exterior Wash for $50 (about 1–2 more hours): hand wash, rim cleaning, tire scrub and degrease, door jambs, tire shine and a spot-free hand dry.' },
      FAQ_TIME,
      FAQ_WATER,
      FAQ_PAY,
    ],
    service: { type: 'Mobile interior car detailing', offers: [['Basic Detail', 150], ['Premium Interior Detail', 200]] },
  },
  {
    path: '/car-stain-removal-anaheim',
    kind: 'service',
    nav: 'Seat & carpet stain removal',
    city: HOME_CITY,
    title: fitTitle('Car Stain Removal', HOME_CITY),
    description: 'Car seat and carpet stain removal in Anaheim, CA: full shampoo, cloth and carpet extraction and a UV-protectant coating in the $200 Premium Interior Detail.',
    eyebrow: 'Stain removal · Anaheim, CA',
    h1: ['Car seat & carpet stain removal', 'in Anaheim.'],
    lede: 'Shampoo and extraction for stained cloth seats and carpet, done in your driveway as part of the $200 Premium Interior Detail.',
    facts: ['$200 for any vehicle', 'Shampoo + extraction', 'About 3–5 hours'],
    card: 'premium',
    photo: PHOTO.ford,
    intro: {
      h2: 'Shampoo first, then pull it out.',
      paras: [
        'Coffee, soda, mud and whatever the kids spilled: a vacuum lifts the crumbs, but stains sit down in the fibers.',
        'The Premium Interior Detail shampoos the seats and carpet, then extracts the dirty water so the stain comes out with it. It also includes deep carpet cleaning, triple-stage vacuuming, dust elimination, interior windows and a UV-protectant coating.',
        'Most stains come out. Old, set-in stains like ink or dye may only get lighter.',
      ],
    },
    points: [
      { title: 'Seats and carpet', text: 'Cloth seats, floor carpet and mats shampooed and extracted.' },
      { title: 'At your address', text: 'We bring the water, power and extractor.' },
      { title: 'One price', text: '$200 for every vehicle size, plus $50 if you add the Exterior Wash.' },
    ],
    faqs: [
      { q: 'Which package removes stains?', a: 'The Premium Interior Detail ($200): it includes full interior shampooing and cloth and carpet extraction. The Basic Detail is a vacuum, wipe-down and floor mat cleaning.' },
      { q: 'Will every stain come out?', a: 'Most do. Old or set-in stains, like ink or dye, may only fade.' },
      { q: 'How long until the seats dry?', a: 'Extraction removes most of the water. Leaving the windows cracked for a few hours afterward helps the rest dry.' },
      FAQ_GUARANTEE,
      FAQ_WATER,
    ],
    service: { type: 'Car seat and carpet stain removal', offers: [['Premium Interior Detail', 200], ['Premium Interior Detail + Exterior Wash', 250]] },
  },
  {
    path: '/full-detail-and-wash-anaheim',
    kind: 'service',
    nav: 'Full detail + hand wash',
    city: HOME_CITY,
    title: fitTitle('Full Detail & Hand Wash', HOME_CITY),
    description: 'Full detail and hand wash in Anaheim, CA: Premium Interior Detail plus Exterior Wash for $250, or Basic Detail plus wash for $200. We come to you.',
    eyebrow: 'Inside + out · Anaheim, CA',
    h1: ['Full detail & hand wash', 'in Anaheim.'],
    lede: 'Pair either interior detail with the Exterior Wash and the whole car is done in one visit at your home.',
    facts: ['$200 or $250 total', 'One visit', 'Any vehicle size'],
    card: 'combo',
    photo: PHOTO.infiniti,
    intro: {
      h2: 'Inside and out, same visit.',
      paras: [
        'The Exterior Wash is an add-on, so a full detail starts with an interior package: Basic + wash for $200, or Premium + wash for $250.',
        'Outside: a hand-washed exterior, detailed rim cleaning, a tire scrub and degrease, a door jamb and panel wipe-down, tire shine and a spot-free hand dry.',
        'Inside: the Basic covers triple-stage vacuuming, a surface wipe-down and floor mats; the Premium adds shampoo, extraction, interior windows and a UV-protectant coating.',
      ],
    },
    points: [
      { title: 'Two combinations', text: 'Basic + wash ($200) or Premium + wash ($250).' },
      { title: 'Plan the time', text: 'The wash adds about 1–2 hours to the interior detail.' },
      { title: 'Guaranteed', text: 'Every detail comes with our satisfaction guarantee.' },
    ],
    faqs: [
      FAQ_WASH,
      { q: 'How long is a full detail and wash?', a: 'Basic + wash is about 3–5 hours in total; Premium + wash about 4–7 hours, depending on the car.' },
      FAQ_WATER,
      FAQ_GUARANTEE,
      FAQ_PAY,
    ],
    service: { type: 'Interior detailing and exterior hand wash', offers: [['Basic Detail + Exterior Wash', 200], ['Premium Interior Detail + Exterior Wash', 250]] },
  },
  {
    path: '/pickup-truck-detailing-anaheim',
    kind: 'service',
    nav: 'Pickup truck detailing',
    city: HOME_CITY,
    title: fitTitle('Pickup Truck Detailing', HOME_CITY),
    description: 'Pickup truck detailing in Anaheim, CA at the same price as a car: $150 Basic, $200 Premium Interior, plus a $50 hand wash. Done at your home.',
    eyebrow: 'Pickup trucks · Anaheim, CA',
    h1: ['Pickup truck detailing', 'in Anaheim.'],
    lede: 'Crew cabs and work trucks pay the same as a sedan: $150 Basic, $200 Premium Interior, +$50 for the hand wash.',
    facts: ['No truck upcharge', 'Rear bench included', 'Water & power included'],
    card: 'premium',
    photo: PHOTO.denali,
    intro: {
      h2: 'Work truck or weekend truck, same price.',
      paras: [
        'Pickups pick up everything: job-site dust, mud on the floor mats, a back seat that doubles as storage. They pay the same package price as a car.',
        'The Basic Detail covers both rows with triple-stage vacuuming, a complete surface wipe-down and floor mat cleaning. The Premium Interior Detail adds deep carpet cleaning, extraction, full interior shampooing and a UV-protectant coating.',
        'Add the Exterior Wash for $50: hand wash, rim cleaning, tire scrub and degrease, and tire shine.',
      ],
    },
    points: [
      { title: 'No upcharge', text: '$150 Basic, $200 Premium Interior, whatever you drive.' },
      { title: 'Both rows', text: 'Front seats, rear bench and floor carpet are all part of the detail.' },
      { title: 'At your driveway', text: 'We bring our own water and power.' },
    ],
    faqs: [
      { q: 'Do trucks cost more?', a: 'No. Every vehicle size pays the same package price.' },
      { q: 'Which package for a work truck?', a: 'Premium Interior, if the carpet or cloth seats are heavily soiled: it adds shampoo and extraction. Basic suits a truck that needs a deep vacuum and wipe-down.' },
      FAQ_TIME,
      FAQ_WASH,
      FAQ_WATER,
    ],
    service: { type: 'Pickup truck detailing', offers: DETAIL_OFFERS },
  },
];

function areaPage({ slug, city, description, lede, intro, photo, localH2, localText, spots, spotsLabel = 'Areas we cover', faqs }) {
  return {
    path: `/mobile-car-detailing-${slug}`,
    kind: 'city',
    nav: city,
    city,
    title: fitTitle('Mobile Car Detailing', city),
    description,
    eyebrow: `Mobile detailing · ${city}, CA`,
    h1: ['Mobile car detailing', `in ${city}.`],
    lede,
    facts: ['Interior from $150', 'Satisfaction guaranteed', '7 days, 7 AM–7 PM'],
    card: 'premium',
    photo,
    intro,
    points: [
      { title: `At your home in ${city}`, text: 'Driveway, garage or curb, with our own water and power.' },
      { title: 'Same price, any size', text: 'Cars, SUVs and trucks all pay the same.' },
      { title: 'Pay now or later', text: 'Prepay online with code PREPAY and save $15, or pay after the detail.' },
    ],
    local: { h2: localH2, text: localText, spots, spotsLabel, map: `${city}, CA` },
    faqs: [...faqs, FAQ_PACKAGES, FAQ_TIME, FAQ_GUARANTEE],
    service: { type: 'Mobile car detailing', offers: DETAIL_OFFERS },
  };
}

export const CITY_PAGES = [
  areaPage({
    slug: 'villa-park',
    city: 'Villa Park',
    description: 'Mobile car detailing in Villa Park, CA. Interior details from $150, shampoo and extraction for $200, and a $50 hand wash add-on. Book online.',
    lede: 'Interior detailing at your Villa Park home, with an optional hand wash. Book any day from 7 AM to 7 PM.',
    photo: PHOTO.infiniti,
    intro: {
      h2: 'Quiet streets, long driveways.',
      paras: [
        'Villa Park is a short drive east of Anaheim. Big lots and long driveways give us plenty of room, and we bring our own water and power.',
        'Book the Basic Detail (about 2–3 hours) for triple-stage vacuuming, a full surface wipe-down and floor mats, or the Premium Interior Detail (about 3–5 hours) for shampoo, extraction and a UV-protectant coating.',
        'Add the Exterior Wash for $50 to have the outside hand-washed and dried in the same visit.',
      ],
    },
    localH2: 'Around Villa Park.',
    localText: 'We come to homes across Villa Park, from the streets along Santiago Boulevard to the neighborhoods off Villa Park Road and Taft Avenue.',
    spots: ['Along Santiago Boulevard', 'Along Villa Park Road', 'Along Taft Avenue'],
    faqs: [
      { q: 'Can you work in a gated community?', a: 'Yes. Add the gate instructions when you book, or call us before the appointment, so we can get in.' },
    ],
  }),
  areaPage({
    slug: 'north-tustin',
    city: 'North Tustin',
    description: 'Mobile car detailing in North Tustin, CA. Interior details from $150 and a $50 hand wash add-on, done in your driveway. Open 7 days, 7 AM to 7 PM.',
    lede: 'Interior detailing in your North Tustin driveway, with an optional hand wash. No drop-off needed.',
    photo: PHOTO.tacoma,
    intro: {
      h2: 'Up the 55, into the hills.',
      paras: [
        'North Tustin sits in the foothills south-east of Anaheim, a short drive down the 55. Hillside driveways are fine; we just need room around the car.',
        'The Basic Detail is triple-stage vacuuming, a complete interior surface wipe-down and floor mat cleaning. The Premium Interior Detail adds dust elimination, interior windows, deep carpet cleaning, extraction, full shampooing and a UV-protectant coating.',
        'Every vehicle pays the same price, and the Exterior Wash adds a hand wash for $50.',
      ],
    },
    localH2: 'Across North Tustin.',
    localText: 'We come to homes across North Tustin, from Lemon Heights and Cowan Heights to the streets along Newport Avenue and Red Hill Avenue.',
    spots: ['Lemon Heights', 'Cowan Heights', 'Along Newport Avenue', 'Along Red Hill Avenue'],
    spotsLabel: 'Neighborhoods we cover',
    faqs: [
      { q: 'My driveway is steep. Is that a problem?', a: 'Usually not. We need to park next to the car and open every door. If the driveway is very steep or tight, the car can sit at the curb, or call us before the appointment.' },
    ],
  }),
  areaPage({
    slug: 'orange-park-acres',
    city: 'Orange Park Acres',
    description: 'Mobile car detailing in Orange Park Acres, CA. Interior details from $150, shampoo and extraction for $200, plus a $50 hand wash. We bring water and power.',
    lede: 'Interior detailing at your Orange Park Acres home, with an optional hand wash. We bring our own water and power.',
    photo: PHOTO.denali,
    intro: {
      h2: 'Room to work, no hookups needed.',
      paras: [
        'Orange Park Acres is a semi-rural pocket east of Anaheim, with large lots and trucks that see dirt roads. We bring our own water and power, so it doesn’t matter how far the car is from the house.',
        'Choose the Basic Detail for triple-stage vacuuming, a surface wipe-down and floor mats, or the Premium Interior Detail for shampoo, cloth and carpet extraction and a UV-protectant coating.',
        'Add the Exterior Wash for $50 to take the dust off in the same visit.',
      ],
    },
    localH2: 'Around Orange Park Acres.',
    localText: 'We come to homes across Orange Park Acres, from Santiago Canyon Road to the properties along Chapman Avenue and Orange Park Boulevard.',
    spots: ['Along Santiago Canyon Road', 'Along Chapman Avenue', 'Along Orange Park Boulevard'],
    faqs: [
      { q: 'The car is far from the house. Is that OK?', a: 'Yes. We bring our own water and power, so we don’t need a hose or an outlet. Add directions when you book if the car is hard to find.' },
    ],
  }),
  areaPage({
    slug: 'west-anaheim',
    city: 'West Anaheim',
    description: 'Mobile car detailing in West Anaheim, CA. Interior details from $150 and a $50 hand wash add-on, at your home or office. Book online, open 7 days.',
    lede: 'Interior detailing at your West Anaheim home or office, with an optional hand wash. Book any day, 7 AM to 7 PM.',
    photo: PHOTO.honda,
    intro: {
      h2: 'Close to home, across the west side.',
      paras: [
        'West Anaheim stretches from Euclid Street toward the city’s western edge. Driveways, apartment lots and curbside spots all work, as long as we can open every door.',
        'Pick the Basic Detail for triple-stage vacuuming, a complete interior surface wipe-down and floor mats, or the Premium Interior Detail for shampoo, extraction and a UV-protectant coating.',
        'The Exterior Wash adds a hand wash, rim cleaning and tire shine for $50, in the same visit.',
      ],
    },
    localH2: 'Across West Anaheim.',
    localText: 'We detail cars at homes and offices across West Anaheim, from Euclid Street to the neighborhoods along Brookhurst Street, Lincoln Avenue and Ball Road.',
    spots: ['Along Euclid Street', 'Along Brookhurst Street', 'Along Lincoln Avenue', 'Along Ball Road'],
    faqs: [
      { q: 'I live in an apartment. Can you still come?', a: 'Yes, if we can park next to your car and the property allows it. If your complex has rules about service vehicles, call us before the appointment.' },
    ],
  }),
];

export const LANDING_PAGES = [...SERVICE_PAGES, ...CITY_PAGES];

export function findLanding(pathname) {
  return LANDING_PAGES.find((p) => p.path === pathname);
}
