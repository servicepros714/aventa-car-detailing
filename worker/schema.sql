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
