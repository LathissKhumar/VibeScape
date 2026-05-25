-- ============================================================
-- Rate Limits table for Postgres-backed rate limiting
-- Run this in Supabase SQL Editor or via drizzle migration
-- ============================================================

-- 1. Rate limits table
-- Each row tracks a single rate limit key with its current count,
-- window start timestamp, and window duration in seconds.
CREATE TABLE IF NOT EXISTS rate_limits (
  key text PRIMARY KEY,
  count int NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now(),
  window_sec int NOT NULL
);

-- Allow public access for rate limit operations
-- (rate limits are self-imposed and don't contain sensitive data)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rate_limits_all" ON rate_limits FOR ALL USING (true);

-- 2. Atomic rate limit increment function
-- Called via supabase.rpc('increment_rate_limit', { p_key, p_window_sec })
--
-- This function atomically:
--   a) Creates a new entry if one doesn't exist (count = 1)
--   b) Resets the count if the window has expired (count = 1, new window)
--   c) Increments the count if still within the window (count + 1)
--
-- Returns the updated row: count, window_start, window_sec
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_key text,
  p_window_sec int
)
RETURNS TABLE(
  count int,
  window_start timestamptz,
  window_sec int
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_now timestamptz := now();
  v_existing rate_limits%ROWTYPE;
BEGIN
  -- Lock the row for atomicity
  SELECT * INTO v_existing FROM rate_limits WHERE key = p_key FOR UPDATE;

  IF NOT FOUND THEN
    -- First ever request for this key: insert with count = 1
    INSERT INTO rate_limits (key, count, window_start, window_sec)
    VALUES (p_key, 1, v_now, p_window_sec)
    RETURNING rate_limits.count, rate_limits.window_start, rate_limits.window_sec
    INTO count, window_start, window_sec;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Check if the window has expired (elapsed time >= window duration)
  IF EXTRACT(EPOCH FROM (v_now - v_existing.window_start)) >= v_existing.window_sec THEN
    -- Window expired: reset count to 1 and start a new window
    UPDATE rate_limits
    SET count = 1, window_start = v_now, window_sec = p_window_sec
    WHERE key = p_key
    RETURNING rate_limits.count, rate_limits.window_start, rate_limits.window_sec
    INTO count, window_start, window_sec;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Still within the window: increment the counter
  UPDATE rate_limits
  SET count = count + 1
  WHERE key = p_key
  RETURNING rate_limits.count, rate_limits.window_start, rate_limits.window_sec
  INTO count, window_start, window_sec;
  RETURN NEXT;
END;
$$;

-- ============================================================
-- Usage (TypeScript):
--   const { data, error } = await supabase.rpc('increment_rate_limit', {
--     p_key: 'my-rate-limit-key',
--     p_window_sec: 60,
--   });
--   if (!error && data?.[0]) {
--     const { count, window_start, window_sec } = data[0];
--     // Compare count against your limit, compute remaining & reset
--   }
-- ============================================================
