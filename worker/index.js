// Aventa Car Detailing — Cloudflare Worker
// Source tag: aventa-anaheim   |   Booking ID prefix: AVT-
// Talks to the shared D1 database `detailing-bookings` (account austin80565).
// Deploy manually via the Cloudflare dashboard: bind D1 as `DB`, set
// STRIPE_SECRET_KEY as a Worker secret, and set the Worker's custom domain.

const SOURCE = 'aventa-anaheim'
const PREFIX = 'AVT-'

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
  'Access-Control-Allow-Headers': 'Content-Type',
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
      if (pathname === '/api/bookings' && request.method === 'POST') {
        const body = await request.json()
        const id = newBookingId()
        const created_at = new Date().toISOString()

        await env.DB.prepare(
          `INSERT INTO bookings
            (id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at, status, payment_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          id, body.date, body.time, body.service, body.name, body.phone, body.email,
          body.vehicle || '', body.address || '', body.notes || '', SOURCE, created_at,
          'Confirmed', body.payment_status === 'Paid' ? 'Paid' : 'Pay Later'
        ).run()

        return json({ id, date: body.date, time: body.time, service: body.service })
      }

      // GET /api/bookings/:id?source=...
      const singleMatch = pathname.match(/^\/api\/bookings\/([^/]+)$/)
      if (singleMatch && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          `SELECT id, date, time, service, name, phone, email, vehicle, address, notes, status, payment_status
           FROM bookings WHERE id = ? AND source = ?`
        ).bind(singleMatch[1], SOURCE).all()
        if (!results.length) return json({ error: 'Not found' }, 404)
        return json(results[0])
      }

      // PATCH /api/bookings/:id  (admin dashboard reschedule/status updates included)
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

      // POST /api/create-payment-intent
      if (pathname === '/api/create-payment-intent' && request.method === 'POST') {
        const { amount } = await request.json()
        if (!amount || amount <= 0) return json({ error: 'Invalid amount' }, 400)

        const params = new URLSearchParams()
        params.set('amount', String(Math.round(amount * 100))) // cents
        params.set('currency', 'usd')
        params.set('automatic_payment_methods[enabled]', 'true')
        params.set('metadata[source]', SOURCE)

        const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        })

        if (!stripeRes.ok) {
          const errBody = await stripeRes.text()
          return json({ error: 'Stripe error', details: errBody }, 502)
        }

        const intent = await stripeRes.json()
        return json({ clientSecret: intent.client_secret })
      }

      return json({ error: 'Not found' }, 404)
    } catch (err) {
      return json({ error: 'Server error', message: err.message }, 500)
    }
  },
}
