-- Run this in the Supabase SQL Editor to create the caching table

CREATE TABLE IF NOT EXISTS spotify_cache (
  id text PRIMARY KEY, -- e.g., 'top_tracks_user123', 'audio_features_track456'
  user_id text NOT NULL,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS spotify_cache_user_id_idx ON spotify_cache (user_id);
