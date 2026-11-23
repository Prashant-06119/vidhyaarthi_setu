-- Vidyaarthi Setu — PostgreSQL / Supabase Cloud Synchronization Schema
-- Supports offline-first event ingestion with idempotent event_id deduplication.

CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_kn TEXT,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 6 AND 8),
  school_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  student_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('attempt', 'lesson_completed', 'intervention_updated')),
  payload JSONB NOT NULL,
  client_created_at TIMESTAMPTZ NOT NULL,
  server_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_events_student_id
  ON public.learning_events (student_id);

CREATE INDEX IF NOT EXISTS idx_learning_events_client_created
  ON public.learning_events (client_created_at DESC);

CREATE TABLE IF NOT EXISTS public.teacher_interventions (
  id TEXT PRIMARY KEY,
  gap_key TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  misconception_id TEXT,
  title_en TEXT NOT NULL,
  affected_student_ids TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('open', 'completed')) DEFAULT 'open',
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security for production deployment
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_interventions ENABLE ROW LEVEL SECURITY;

-- Example classroom policy (adjust to school/teacher auth claims in production)
CREATE POLICY "Allow authenticated classroom access on learning_events"
  ON public.learning_events
  FOR ALL
  USING (true)
  WITH CHECK (true);
