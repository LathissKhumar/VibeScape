-- ============================================================
-- Resona — Unified Supabase Setup
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/ikmpbfmattuecerbqrhe/sql
-- ============================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Core schema: users, tracks, events, snapshots
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  name text,
  spotify_id text UNIQUE,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS tracks (
  id text PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS tracks_user_id_idx ON tracks (user_id);

CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  type text NOT NULL,
  payload jsonb,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events (user_id);
CREATE INDEX IF NOT EXISTS events_type_idx ON events (type);

CREATE TABLE IF NOT EXISTS snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS snapshots_entity_idx ON snapshots (entity_type, entity_id);

-- 3. Cache table (replaces Redis hot-tier for single-tier Supabase setup)
CREATE TABLE IF NOT EXISTS spotify_cache (
  id text PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  data jsonb NOT NULL,
  expires_at timestamptz,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS spotify_cache_expires_idx ON spotify_cache (expires_at);

-- Auto-cleanup of expired cache entries (runs every hour via pg_cron if enabled)
-- Note: pg_cron requires Supabase Pro plan. For free tier, use Edge Function cron.
-- SELECT cron.schedule('cache-cleanup', '0 * * * *', 'DELETE FROM spotify_cache WHERE expires_at < now()');

-- 4. Embeddings table (pgvector)
CREATE TABLE IF NOT EXISTS embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  vector vector(64),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(entity_type, entity_id)
);
CREATE INDEX IF NOT EXISTS embeddings_vector_idx ON embeddings USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);

-- 5. Feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  key text PRIMARY KEY,
  value boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Seed default feature flags
INSERT INTO feature_flags (key, value) VALUES
  ('galaxy_3d', true),
  ('friend_comparison', true),
  ('personality_card_export', true),
  ('listening_timeline', true),
  ('ai_insights', true)
ON CONFLICT (key) DO NOTHING;

-- 7. RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE spotify_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Public read access for feature flags
CREATE POLICY "feature_flags_public_read" ON feature_flags
  FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Tracks: users can read their own
CREATE POLICY "tracks_read_own" ON tracks
  FOR SELECT USING (auth.uid() = user_id);

-- Events: users can read their own
CREATE POLICY "events_read_own" ON events
  FOR SELECT USING (auth.uid() = user_id);

-- Snapshots: public read (used for shareable comparisons)
CREATE POLICY "snapshots_public_read" ON snapshots
  FOR SELECT USING (true);

-- Cache: public read/write (safe for caching Spotify data)
CREATE POLICY "spotify_cache_public" ON spotify_cache
  FOR ALL USING (true);

-- Embeddings: public read/write (safe for similarity search)
CREATE POLICY "embeddings_public" ON embeddings
  FOR ALL USING (true);

-- 8. Helper function: similarity search for embeddings
-- Uses IVFFlat index (100 lists). SET ivfflat.probes = 10 for ~10× recall
-- at minimal performance cost. Higher values (20–50) improve recall further.
CREATE OR REPLACE FUNCTION find_similar_profiles(
  query_vector vector(64),
  match_threshold float DEFAULT 0.8,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  entity_type text,
  entity_id text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Optimize IVFFlat recall: 10 probes for 100-list index (sweet spot)
  PERFORM set_config('ivfflat.probes', '10', true);
  RETURN QUERY
  SELECT
    e.entity_type,
    e.entity_id,
    1 - (e.vector <=> query_vector) AS similarity
  FROM embeddings e
  WHERE 1 - (e.vector <=> query_vector) > match_threshold
  ORDER BY e.vector <=> query_vector
  LIMIT match_count;
END;
$$;

-- ============================================================
-- Verification queries (run after setup):
-- ============================================================
-- SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT key, value FROM feature_flags;
