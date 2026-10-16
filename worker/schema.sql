-- Shared database: detailing-bookings-remoticojobs
-- Uses IF NOT EXISTS for cross-site safety — safe to run against the
-- existing shared database without affecting other sites.

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  service TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  vehicle TEXT,
  address TEXT,
  notes TEXT,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT DEFAULT 'Confirmed',
  reschedule_date TEXT,
  reschedule_time TEXT,
  notes2 TEXT,
  original_date TEXT,
  original_time TEXT,
  payment_status TEXT DEFAULT 'Pay Later'
);

CREATE INDEX IF NOT EXISTS idx_bookings_source_date ON bookings (source, date);

-- Per-IP daily cap on online bookings (anti-spam). Stores a SHA-256 hash of
-- "<source>:<ip>", never the raw IP.
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
