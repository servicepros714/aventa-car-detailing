// Aventa Car Detailing — Cloudflare Worker
// Source tag: aventa-anaheim   |   Booking ID prefix: AVT-
// Talks to the D1 database `detailing-bookings-remoticojobs` (bound as `DB`,
// see worker/wrangler.jsonc). All reads/writes are scoped by `source`.
//
// Secrets (set with `npx wrangler secret put <NAME>`):
//   STRIPE_SECRET_KEY      Stripe secret key
//   STRIPE_WEBHOOK_SECRET  signing secret of the Stripe webhook -> /api/stripe-webhook
//   ADMIN_TOKEN            required as `Authorization: Bearer <token>` for
//                          GET/PATCH /api/bookings/:id (admin dashboard)
//
// Deploy: `npx wrangler deploy` from the worker/ directory.
// Worker URL: aventa-car-detailing-v2.remoticojobs.workers.dev

const SOURCE = 'aventa-anaheim'
const BUSINESS_NAME = 'Aventa Car Detailing'
const PREFIX = 'AVT-'
const PREPAY_DISCOUNT = 15

// Source of truth for pricing (whole dollars). Must match `services` in src/lib/siteConfig.js.
const SERVICES = {
  basic: { name: 'Basic Detail', price: 150 },
  premium: { name: 'Premium Interior Detail', price: 200 },
}
const EXTERIOR_ADDON = { name: 'Exterior Wash', price: 50 }

const PATCHABLE = new Set([
  'status',
  'payment_status',
  'reschedule_date',
  'reschedule_time',
  'original_date',
  'original_time',
  'notes2',
])

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

function newBookingId() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `${PREFIX}${Date.now().toString(36).toUpperCase()}${rand}`
}

// Applies a coupon to a subtotal -> { coupon, total } (whole dollars).
function applyCoupon(subtotal, code) {
  const valid = (code || '').trim().toUpperCase() === 'PREPAY'
  return { coupon: valid ? 'PREPAY' : null, total: Math.max(subtotal - (valid ? PREPAY_DISCOUNT : 0), 0) }
}

async function timingSafeEqual(a, b) {
  const enc = new TextEncoder()
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ])
  return crypto.subtle.timingSafeEqual(ha, hb)
}

async function isAdmin(request, env) {
  const header = request.headers.get('Authorization') || ''
  if (!env.ADMIN_TOKEN || !header.startsWith('Bearer ')) return false
  return timingSafeEqual(header.slice(7), env.ADMIN_TOKEN)
}

// Verifies a Stripe webhook signature (Stripe-Signature: t=...,v1=...,v1=...).
async function verifyStripeSignature(payload, header, secret, toleranceSec = 300) {
  if (!header || !secret) return false
  const items = header.split(',').map((kv) => kv.trim())
  const timestamp = Number((items.find((kv) => kv.startsWith('t=')) || '').slice(2))
  const signatures = items.filter((kv) => kv.startsWith('v1=')).map((kv) => kv.slice(3))
  if (!timestamp || !signatures.length) return false
  if (Math.abs(Date.now() / 1000 - timestamp) > toleranceSec) return false

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`))
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')
  for (const sig of signatures) {
    if (await timingSafeEqual(sig, expected)) return true
  }
  return false
}

async function stripeRequest(env, path, params, method = 'POST') {
  const res = await fetch(`https://api.stripe.com${path}${method === 'GET' ? `?${params}` : ''}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: method === 'GET' ? undefined : params,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Stripe error')
  return data
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url

    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

    try {
      // GET /api/availability?source=...&date=YYYY-MM-DD
      if (pathname === '/api/availability' && request.method === 'GET') {
        const date = url.searchParams.get('date')
        if (!date) return json({ error: 'date is required' }, 400)
        const { results } = await env.DB.prepare(
          `SELECT time FROM bookings WHERE source = ? AND date = ? AND status != 'Cancelled'`
        ).bind(SOURCE, date).all()
        return json({ bookedSlots: results.map((r) => r.time) })
      }

      // POST /api/bookings
      // Price is computed here from serviceId / exteriorAddOn / coupon — never taken from the client.
      // payment_status always starts as 'Pay Later'; only the Stripe webhook marks it 'Paid'.
      if (pathname === '/api/bookings' && request.method === 'POST') {
        const body = await request.json()
        for (const field of ['date', 'time', 'serviceId', 'name', 'phone', 'email']) {
          if (!body[field]) return json({ error: `${field} is required` }, 400)
        }
        const service = SERVICES[body.serviceId]
        if (!service) return json({ error: 'Unknown service.' }, 400)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) return json({ error: 'Invalid date.' }, 400)

        const clash = await env.DB.prepare(
          `SELECT id FROM bookings WHERE date = ? AND time = ? AND source = ? AND status != 'Cancelled'`
        ).bind(body.date, body.time, SOURCE).first()
        if (clash) return json({ error: 'That time slot was just booked. Please choose another.' }, 409)

        const addOn = body.exteriorAddOn === true
        const serviceName = addOn ? `${service.name} + ${EXTERIOR_ADDON.name}` : service.name
        const subtotal = service.price + (addOn ? EXTERIOR_ADDON.price : 0)
        const { coupon, total } = applyCoupon(subtotal, body.coupon)
        const id = newBookingId()
        const created_at = new Date().toISOString()

        await env.DB.prepare(
          `INSERT INTO bookings
            (id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at,
             status, payment_status, subtotal, coupon, total)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', 'Pay Later', ?, ?, ?)`
        ).bind(
          id, body.date, body.time, serviceName, body.name, body.phone, body.email,
          body.vehicle || '', body.address || '', body.notes || '', SOURCE, created_at,
          subtotal, coupon, total
        ).run()

        return json({ id, date: body.date, time: body.time, service: serviceName, address: body.address || '', subtotal, coupon, total }, 201)
      }

      // GET / PATCH /api/bookings/:id — admin only
      const singleMatch = pathname.match(/^\/api\/bookings\/([^/]+)$/)
      if (singleMatch && (request.method === 'GET' || request.method === 'PATCH') && !(await isAdmin(request, env))) {
        return json({ error: 'Unauthorized' }, 401)
      }
      if (singleMatch && request.method === 'GET') {
        const row = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ? AND source = ?`)
          .bind(singleMatch[1], SOURCE).first()
        if (!row) return json({ error: 'Not found' }, 404)
        return json(row)
      }

      // PATCH /api/bookings/:id  (admin dashboard reschedule/status updates)
      if (singleMatch && request.method === 'PATCH') {
        const body = await request.json()
        const fields = Object.keys(body).filter((k) => PATCHABLE.has(k))
        if (!fields.length) return json({ error: 'No patchable fields provided' }, 400)

        const setClause = fields.map((f) => `${f} = ?`).join(', ')
        const values = fields.map((f) => body[f])
        await env.DB.prepare(
          `UPDATE bookings SET ${setClause} WHERE id = ? AND source = ?`
        ).bind(...values, singleMatch[1], SOURCE).run()

        return json({ id: singleMatch[1], updated: fields })
      }

      // POST /api/create-payment-intent   { bookingId, coupon }
      // The amount charged is the booking's server-computed total — any client amount is ignored.
      if (pathname === '/api/create-payment-intent' && request.method === 'POST') {
        const { bookingId, coupon: couponCode } = await request.json()
        if (!bookingId) return json({ error: 'bookingId is required' }, 400)

        const booking = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ? AND source = ?`)
          .bind(bookingId, SOURCE).first()
        if (!booking) return json({ error: 'Booking not found' }, 404)
        if (booking.payment_status === 'Paid') return json({ error: 'This booking is already paid.' }, 409)
        if (booking.subtotal == null) return json({ error: 'Booking has no price on file.' }, 400)

        // The coupon can be applied on the checkout page after the booking is created.
        const { coupon, total } = applyCoupon(booking.subtotal, couponCode)
        const amount = total * 100 // cents
        if (amount < 50) return json({ error: 'Invalid amount' }, 400)
        if (coupon !== booking.coupon || total !== booking.total) {
          await env.DB.prepare(`UPDATE bookings SET coupon = ?, total = ? WHERE id = ? AND source = ?`)
            .bind(coupon, total, booking.id, SOURCE).run()
        }

        // Reuse the open PaymentIntent for this booking when the amount hasn't changed;
        // otherwise cancel it so abandoned amounts don't pile up as 'Incomplete' in Stripe.
        if (booking.payment_intent_id) {
          const existing = await stripeRequest(env, `/v1/payment_intents/${booking.payment_intent_id}`, new URLSearchParams(), 'GET')
          if (existing.status === 'succeeded') return json({ error: 'This booking is already paid.' }, 409)
          if (existing.status === 'processing') return json({ error: 'A payment for this booking is already processing.' }, 409)
          if (existing.status !== 'canceled') {
            if (existing.amount === amount) return json({ clientSecret: existing.client_secret, amount })
            await stripeRequest(env, `/v1/payment_intents/${existing.id}/cancel`, new URLSearchParams({ cancellation_reason: 'abandoned' }))
              .catch(() => {}) // best effort — never block checkout on cleanup
          }
        }

        const params = new URLSearchParams({
          amount: String(amount),
          currency: 'usd',
          'automatic_payment_methods[enabled]': 'true', // NOT payment_method_types[] — required for Link/Apple Pay/Google Pay
          description: `${BUSINESS_NAME}: ${booking.service} on ${booking.date} at ${booking.time}`,
          receipt_email: booking.email,
          'metadata[bookingId]': booking.id,
          'metadata[source]': SOURCE,
        })
        const intent = await stripeRequest(env, '/v1/payment_intents', params)
        await env.DB.prepare(`UPDATE bookings SET payment_intent_id = ? WHERE id = ? AND source = ?`)
          .bind(intent.id, booking.id, SOURCE).run()
        return json({ clientSecret: intent.client_secret, amount })
      }

      // POST /api/stripe-webhook — Stripe calls this; marks bookings Paid / Refunded.
      // The Stripe account is shared with other sites, so events for other sources are acknowledged and ignored.
      if (pathname === '/api/stripe-webhook' && request.method === 'POST') {
        const payload = await request.text()
        const valid = await verifyStripeSignature(payload, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET)
        if (!valid) return json({ error: 'Invalid signature' }, 400)

        const event = JSON.parse(payload)
        const obj = event.data?.object || {}

        if (event.type === 'payment_intent.succeeded' && obj.metadata?.source === SOURCE && obj.metadata?.bookingId) {
          await env.DB.prepare(
            `UPDATE bookings SET payment_status = 'Paid', payment_intent_id = ? WHERE id = ? AND source = ?`
          ).bind(obj.id, obj.metadata.bookingId, SOURCE).run()
        }

        if (event.type === 'charge.refunded' && obj.payment_intent) {
          const status = obj.amount_refunded >= obj.amount ? 'Refunded' : 'Partially Refunded'
          await env.DB.prepare(
            `UPDATE bookings SET payment_status = ? WHERE payment_intent_id = ? AND source = ?`
          ).bind(status, obj.payment_intent, SOURCE).run()
        }

        return json({ received: true })
      }

      return json({ error: 'Not found' }, 404)
    } catch (err) {
      return json({ error: 'Server error', message: err.message }, 500)
    }
  },
}
