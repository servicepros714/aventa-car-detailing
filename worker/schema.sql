-- Shared database: detailing-bookings-remoticojobs (also used by apex-car-detailing-v2).
-- Uses IF NOT EXISTS for cross-site safety — safe to run against the
-- existing shared database without affecting other sites.

-- Same layout as the portfolio's `detailing-bookings` database (Luna Glow etc.).
CREATE TABLE IF NOT EXISTS "bookings" (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  service TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  vehicle TEXT,
  address TEXT,
  notes TEXT,
  source TEXT DEFAULT 'imperial-shine',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'Confirmed',
  reschedule_date TEXT,
  reschedule_time TEXT,
  notes2 TEXT,
  original_date TEXT,
  original_time TEXT,
  payment_status TEXT DEFAULT 'Paid'
);

-- Server-computed price and Stripe PaymentIntent per booking (kept out of `bookings`
-- so that table matches the portfolio layout exactly).
CREATE TABLE IF NOT EXISTS booking_payments (
  booking_id TEXT PRIMARY KEY,
  subtotal INTEGER,
  coupon TEXT,
  total INTEGER,
  payment_intent_id TEXT
);

-- Per-IP daily cap on online bookings (anti-spam, off unless BOOKING_LIMITS = "on").
-- Stores a SHA-256 hash of "<source>:<ip>", never the raw IP.
CREATE TABLE IF NOT EXISTS booking_requests (
  source TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_lookup ON booking_requests (source, ip_hash, created_at);

-- One row per notification sent to GHL (GHL_WEBHOOK_URL), so a booking is
-- never announced twice (Stripe retries, repeated confirm requests).
CREATE TABLE IF NOT EXISTS booking_notifications (
  booking_id TEXT NOT NULL,
  event TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (booking_id, event)
);
