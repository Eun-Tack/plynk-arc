-- Syntheses table for storing AI-generated insights from resources
CREATE TABLE IF NOT EXISTS syntheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arc_id UUID NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Synthesis content
  title TEXT NOT NULL,
  insights JSONB NOT NULL DEFAULT '[]',  -- Array of insight objects
  connections JSONB DEFAULT '[]',         -- Resource connections/relationships
  summary TEXT,                            -- Overall summary

  -- Related resources (snapshot at synthesis time)
  resource_ids UUID[] NOT NULL DEFAULT '{}',
  resource_count INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  synthesis_type TEXT DEFAULT 'manual',   -- 'manual' or 'auto'
  status TEXT DEFAULT 'completed',        -- 'pending', 'processing', 'completed', 'failed'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_syntheses_arc_id ON syntheses(arc_id);
CREATE INDEX idx_syntheses_user_id ON syntheses(user_id);
CREATE INDEX idx_syntheses_created_at ON syntheses(created_at DESC);

-- RLS Policies
ALTER TABLE syntheses ENABLE ROW LEVEL SECURITY;

-- Users can view their own syntheses
CREATE POLICY "Users can view own syntheses"
  ON syntheses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view syntheses from public arcs
CREATE POLICY "Users can view public arc syntheses"
  ON syntheses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM arcs
      WHERE arcs.id = syntheses.arc_id
      AND arcs.is_public = true
    )
  );

-- Users can create syntheses for their own arcs
CREATE POLICY "Users can create own syntheses"
  ON syntheses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own syntheses
CREATE POLICY "Users can update own syntheses"
  ON syntheses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own syntheses
CREATE POLICY "Users can delete own syntheses"
  ON syntheses FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_syntheses_updated_at
  BEFORE UPDATE ON syntheses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
