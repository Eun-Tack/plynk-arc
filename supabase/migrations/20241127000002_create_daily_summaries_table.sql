-- Daily Summaries table for storing auto-generated daily insights
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Summary content (same structure as syntheses)
  title TEXT NOT NULL,
  storyline JSONB DEFAULT NULL,
  connections JSONB DEFAULT '[]',
  action_items TEXT[] DEFAULT '{}',

  -- Related resources
  resource_ids UUID[] NOT NULL DEFAULT '{}',
  resource_count INTEGER NOT NULL DEFAULT 0,
  insight_score INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'completed',  -- 'pending', 'completed', 'sent', 'failed'
  sent_at TIMESTAMPTZ,              -- When email was sent

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_daily_summaries_user_id ON daily_summaries(user_id);
CREATE INDEX idx_daily_summaries_created_at ON daily_summaries(created_at DESC);
CREATE INDEX idx_daily_summaries_status ON daily_summaries(status);

-- RLS Policies
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- Users can view their own daily summaries
CREATE POLICY "Users can view own daily summaries"
  ON daily_summaries FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert (cron job)
CREATE POLICY "Service role can insert daily summaries"
  ON daily_summaries FOR INSERT
  WITH CHECK (true);

-- Users can delete their own daily summaries
CREATE POLICY "Users can delete own daily summaries"
  ON daily_summaries FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_daily_summaries_updated_at
  BEFORE UPDATE ON daily_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
