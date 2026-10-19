# Aventa Car Detailing — Setup Guide

Built to the Service Pros portfolio spec: Vite + React 18, 4-step booking flow,
shared `detailing-bookings` D1 database, Stripe checkout with Link/Apple Pay/
Google Pay, Cloudflare Pages + GitHub Actions.

## Site identifiers (registered for this build — don't reuse elsewhere)

| | |
|---|---|
| Business | Aventa Car Detailing (Anaheim, CA) |
| Source tag | `aventa-anaheim` |
| Booking ID prefix | `AVT-` |
| Worker | `aventa-car-detailing-v2` → `aventa-car-detailing-v2.remoticojobs.workers.dev` |
| Cloudflare Pages project | `aventa-car-detailing-v2` (domain: aventacardetailinganaheim.site) |

> `premium-anaheim` is already used by Premium Detailing Solutions (Anaheim) —
> Aventa is a separate business, hence the distinct `aventa-anaheim` tag.

## 1. GitHub repo

1. Push this folder to a new GitHub repo.
2. Add repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
   `VITE_STRIPE_PUBLISHABLE_KEY` (the workflow only needs the first two — the
   Stripe key ships via the committed `.env.local`).

## 2. Cloudflare Pages

1. Create a Pages project named `aventa-car-detailing-v2` (or update
   `.github/workflows/deploy.yml` if you name it differently).
2. Build command `npm run build`, output directory `dist`.
3. Connect the custom domain once DNS/Apple Pay domain verification is done.

## 3. Cloudflare Worker

Config lives in `worker/wrangler.jsonc` (D1 `detailing-bookings-remoticojobs`
bound as `DB`). Deploy with `npx wrangler deploy` from `worker/`.

1. Run `worker/schema.sql` against the shared database once (safe — uses
   `IF NOT EXISTS`, won't affect other sites' data).
2. Set the secrets with `npx wrangler secret put <NAME>`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` — signing secret of the Stripe webhook below
   - `ADMIN_TOKEN` — required by the admin dashboard for GET/PATCH
     `/api/bookings/:id` (kept locally in the gitignored `.admin-token`)
   - `GHL_WEBHOOK_URL` — GoHighLevel webhook trigger; GHL sends the emails
3. `VITE_API_URL` in `.env.local` must point at the Worker URL.

Database layout: `bookings` is identical to the portfolio's `detailing-bookings`
(Luna Glow etc.) — see `worker/schema.sql`. Statuses follow the same pattern:
checkout draft `Pending` / `Incomplete`; Pay Later `Confirmed` / `Pay Later` with
`notes2 = 'Pay Later'`; paid `Confirmed` / `Paid`. IDs are `AVT-` + 8 hex, `created_at`
is UTC `YYYY-MM-DD HH:MM:SS`. Prices and the Stripe PaymentIntent live in
`booking_payments` (shared with Apex, which uses the same database).

Payment flow: checkout creates the booking first (price computed by the Worker),
then a PaymentIntent for that booking's total. Only
the Stripe webhook marks a booking `Paid` / `Refunded` — the browser never
sends prices or payment status. The PaymentIntent is attached to a Stripe
Customer built from the booking (so Stripe shows the booker, not a Link profile).

Notifications: a confirmed booking is posted once to `GHL_WEBHOOK_URL` with the
portfolio payload (`event_type: "booking_confirmed"`) plus `payment_status`
(`Pay Later` / `Paid`), `total` and `notes` — on "Confirm Booking — Pay Later"
(`POST /api/bookings/:id/confirm`) or when the Stripe webhook marks it Paid.

Anti-spam (off on the live site — `BOOKING_LIMITS` var): `BOOKING_LIMITER` (5 booking attempts / IP / minute), max 6 new
bookings / IP / 24h (`booking_requests`, hashed IPs), and server-side checks
that the slot exists, isn't past and is within the 21-day window. Going back
from checkout updates the same unpaid draft booking instead of adding another.

### Stripe test-mode copy

`env.test` in `wrangler.jsonc` deploys `aventa-car-detailing-v2-test` (same
database — delete test bookings afterwards). Give it test-mode secrets with
`--env test`, put the `pk_test_` key in the gitignored `.env.stripetest`, then:

```bash
cd worker && npx wrangler deploy --env test && cd ..
npx vite build --mode stripetest --outDir dist-test
npx wrangler pages deploy dist-test --project-name aventa-car-detailing-v2 --branch stripe-test
```

Test site: https://stripe-test.aventa-car-detailing-v2.pages.dev (card `4242 4242 4242 4242`).
The test webhook destination must be in the same Stripe sandbox as the test keys.

## 4. Stripe

1. Use the existing Stripe account. In **test mode**, make sure Link is
   enabled if you want the Link button to appear while testing.
2. `automatic_payment_methods[enabled]=true` is already set server-side in
   the Worker — this is what makes Link/Apple Pay/Google Pay work without
   listing `payment_method_types[]`.
3. Add a webhook destination for
   `https://aventa-car-detailing-v2.remoticojobs.workers.dev/api/stripe-webhook`
   with events `payment_intent.succeeded` and `charge.refunded`, and set its
   signing secret as `STRIPE_WEBHOOK_SECRET` on the Worker.
4. Complete Apple Pay domain verification for the production domain
   (infra step you handle outside this repo).

## 5. Local development

```bash
npm install
npm run dev
```

`.env.local` is committed with the live `VITE_API_URL` and
`VITE_STRIPE_PUBLISHABLE_KEY` (both safe to expose client-side). `.env` (if you use one) stays gitignored.

## 6. Admin dashboard compatibility

The Worker's `PATCH /api/bookings/:id` endpoint accepts the shared
`PATCHABLE` field set (`status`, `payment_status`, `reschedule_date`,
`reschedule_time`, `original_date`, `original_time`, `notes2`), so this site
is reschedule-compatible with the existing portfolio admin dashboard. The
dashboard must send `Authorization: Bearer <ADMIN_TOKEN>` for GET/PATCH
`/api/bookings/:id`, same as Apex.

## What's different from the rest of the portfolio (by design)

- **Palette:** Deep Navy / Steel Blue / Sky Accent / Chrome, pulled from the
  Aventa badge logo — distinct from Sleek Finish's black/gold.
- **Fonts:** Oswald (headings) + Manrope (body) + Rajdhani (accent/stats) —
  not used elsewhere in the portfolio.
- **Nav:** split-center nav (links left/right, badge wordmark centered) with
  a chrome underline on scroll.
- **Hero:** diagonal chrome-seam split, not a fullscreen background image.
- Everything else — booking flow, service pricing, D1 schema, Stripe
  pattern, sticky mobile bars — follows the shared portfolio standard.
