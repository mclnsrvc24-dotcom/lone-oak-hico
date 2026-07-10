-- Lone Oak Home Improvement Co. — database schema
-- Run once against your Vercel Postgres database (see README).

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  service_category TEXT, -- 'lawn' | 'house_wash' | 'both'
  plan TEXT,             -- 'weekly' | 'biweekly' | 'monthly' | 'one_time'
  agreed_price NUMERIC,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  service_category TEXT NOT NULL, -- 'lawn' | 'house_wash'
  service_type TEXT NOT NULL,
  frequency TEXT,
  preferred_date DATE,
  preferred_time_window TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'scheduled' | 'converted' | 'declined'
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS service_history (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  service_type TEXT NOT NULL,
  price_charged NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_photos (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT photo_owner_check CHECK (
    (customer_id IS NOT NULL) OR (lead_id IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS tiktok_posts (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  planned_date DATE,
  idea TEXT NOT NULL,
  caption TEXT,
  status TEXT NOT NULL DEFAULT 'idea', -- 'idea' | 'planned' | 'filmed' | 'posted'
  post_url TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_service_history_customer ON service_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_photos_customer ON property_photos(customer_id);
CREATE INDEX IF NOT EXISTS idx_photos_lead ON property_photos(lead_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_status ON tiktok_posts(status);
