-- Supabase SQL — run this in the Supabase SQL editor
-- https://supabase.com/dashboard/project/<your-project>/sql

-- Create wishes table
CREATE TABLE IF NOT EXISTS public.wishes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  message     TEXT NOT NULL,
  timestamp   TIMESTAMPTZ DEFAULT NOW(),
  position_x  REAL DEFAULT 0,
  position_y  REAL DEFAULT 0,
  rotation    REAL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read wishes
CREATE POLICY "Anyone can read wishes"
  ON public.wishes FOR SELECT
  USING (true);

-- Allow anyone to insert wishes (you can tighten this later)
CREATE POLICY "Anyone can insert wishes"
  ON public.wishes FOR INSERT
  WITH CHECK (true);

-- Enable Realtime for the wishes table
-- Go to: Supabase Dashboard → Database → Replication → Realtime → Enable for 'wishes'
-- Or run:
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
