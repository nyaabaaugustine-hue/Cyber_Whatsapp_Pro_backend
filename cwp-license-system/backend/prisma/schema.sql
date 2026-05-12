-- ============================================================
-- Cyber WhatsApp Pro - Neon PostgreSQL Schema
-- Run this in your Neon SQL Editor to set up the database
-- ============================================================

CREATE TABLE IF NOT EXISTS licenses (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email         TEXT,
  license_key   TEXT UNIQUE NOT NULL,
  plan          TEXT NOT NULL DEFAULT 'premium',
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  expiry_date   TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activated_at  TIMESTAMP WITH TIME ZONE,
  device_id     TEXT
);

-- Index for fast key lookups
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER licenses_updated_at
  BEFORE UPDATE ON licenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA — Sample license keys for testing
-- ============================================================

INSERT INTO licenses (email, license_key, plan, active, expiry_date)
VALUES
  ('testuser@example.com',  'CWP-PRO-2026-X8A91',  'premium',  TRUE,  NOW() + INTERVAL '1 year'),
  ('vip@example.com',       'CWP-PREM-L9A21M',     'lifetime', TRUE,  NULL),
  ('demo@example.com',      'CWP-PRO-2026-DEMO1',  'premium',  TRUE,  NOW() + INTERVAL '7 days'),
  ('expired@example.com',   'CWP-PRO-2025-EXP99',  'premium',  FALSE, NOW() - INTERVAL '1 day')
ON CONFLICT (license_key) DO NOTHING;
