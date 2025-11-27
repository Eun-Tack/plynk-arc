-- ============================================
-- plynk arc Database Schema (Fixed)
-- PostgreSQL (Supabase)
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- 2. ENUMS
-- ============================================

CREATE TYPE subscription_tier AS ENUM ('free', 'arc_subscription');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE synthesis_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ============================================
-- 3. TABLES
-- ============================================

-- 3.1 사용자 프로필
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  gender gender_type,
  age INT CHECK (age >= 13 AND age <= 120),
  occupation TEXT,

  subscription_tier subscription_tier DEFAULT 'free',
  arc_limit INT DEFAULT 2,

  daily_summary_enabled BOOLEAN DEFAULT true,
  daily_summary_time TIME DEFAULT '09:00:00',
  daily_summary_min_count INT DEFAULT 3,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 3.2 Arcs
CREATE TABLE arcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  goal TEXT,
  icon TEXT DEFAULT '⌒',
  color TEXT DEFAULT '#3B82F6',

  is_public BOOLEAN DEFAULT false,
  share_token UUID DEFAULT gen_random_uuid(),

  auto_synthesis_enabled BOOLEAN DEFAULT true,
  auto_synthesis_threshold INT DEFAULT 10,

  resource_count INT DEFAULT 0,
  last_synthesis_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT name_not_empty CHECK (char_length(name) > 0)
);

-- 3.3 Resources (fts 컬럼 한 번만 정의)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arc_id UUID NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  url TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,

  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  favicon_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Full-text search (한 번만 정의)
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(summary, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'C')
  ) STORED,

  CONSTRAINT url_or_file_required CHECK (url IS NOT NULL OR file_url IS NOT NULL)
);

-- 3.4 Tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT unique_tag_per_user UNIQUE (user_id, name)
);

-- 3.5 Link-Tags
CREATE TABLE link_tags (
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),

  PRIMARY KEY (resource_id, tag_id)
);

-- 3.6 Synthesis History
CREATE TABLE synthesis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arc_id UUID NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  resource_count INT NOT NULL,
  date_range_start TIMESTAMPTZ,
  date_range_end TIMESTAMPTZ,

  summary TEXT,
  insights JSONB,
  patterns JSONB,
  table_schema JSONB,
  table_data JSONB,

  status synthesis_status DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT positive_resource_count CHECK (resource_count > 0)
);

-- 3.7 Daily Summaries
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  arc_id UUID REFERENCES arcs(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  resource_count INT NOT NULL,
  summary TEXT NOT NULL,
  key_findings JSONB,
  recommended_actions JSONB,

  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT unique_daily_summary UNIQUE (user_id, arc_id, date)
);

-- 3.8 Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,

  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3.9 Category Presets
CREATE TABLE category_presets (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT
);

-- ============================================
-- 4. INDEXES
-- ============================================

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_arcs_user ON arcs(user_id, created_at DESC);
CREATE INDEX idx_arcs_share_token ON arcs(share_token) WHERE is_public = true;
CREATE INDEX idx_resources_arc_timeline ON resources(arc_id, created_at DESC);
CREATE INDEX idx_resources_user_timeline ON resources(user_id, created_at DESC);
CREATE INDEX idx_resources_category ON resources(arc_id, category);
CREATE INDEX idx_resources_fts ON resources USING GIN(fts);
CREATE INDEX idx_tags_user ON tags(user_id);
CREATE INDEX idx_link_tags_resource ON link_tags(resource_id);
CREATE INDEX idx_link_tags_tag ON link_tags(tag_id);
CREATE INDEX idx_synthesis_arc ON synthesis_history(arc_id, created_at DESC);
CREATE INDEX idx_synthesis_user ON synthesis_history(user_id, created_at DESC);
CREATE INDEX idx_daily_summaries_user_date ON daily_summaries(user_id, date DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Arcs
ALTER TABLE arcs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own arcs" ON arcs
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own arcs" ON arcs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own arcs" ON arcs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own arcs" ON arcs
  FOR DELETE USING (auth.uid() = user_id);

-- Resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resources" ON resources
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM arcs WHERE arcs.id = resources.arc_id AND arcs.is_public = true)
  );

CREATE POLICY "Users can insert own resources" ON resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources" ON resources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources" ON resources
  FOR DELETE USING (auth.uid() = user_id);

-- Tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

-- Link Tags
ALTER TABLE link_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own link_tags" ON link_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM resources WHERE resources.id = link_tags.resource_id AND resources.user_id = auth.uid())
  );

-- Synthesis History
ALTER TABLE synthesis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own synthesis" ON synthesis_history
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM arcs WHERE arcs.id = synthesis_history.arc_id AND arcs.is_public = true)
  );

CREATE POLICY "Users can insert own synthesis" ON synthesis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Summaries
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own summaries" ON daily_summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries" ON daily_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_arcs_updated_at
  BEFORE UPDATE ON arcs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Arc resource_count 자동 업데이트
CREATE OR REPLACE FUNCTION update_arc_resource_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE arcs SET resource_count = resource_count + 1, updated_at = now() WHERE id = NEW.arc_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE arcs SET resource_count = GREATEST(0, resource_count - 1), updated_at = now() WHERE id = OLD.arc_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintain_arc_resource_count
  AFTER INSERT OR DELETE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_arc_resource_count();

-- ============================================
-- 7. SEED DATA
-- ============================================

INSERT INTO category_presets (name, icon, color) VALUES
  ('Article', '📄', '#3B82F6'),
  ('Video', '🎥', '#EF4444'),
  ('Tool', '🔧', '#10B981'),
  ('Documentation', '📚', '#8B5CF6'),
  ('Research', '🔬', '#F59E0B'),
  ('Tutorial', '🎓', '#EC4899'),
  ('News', '📰', '#06B6D4'),
  ('Reference', '🔖', '#6B7280')
ON CONFLICT (name) DO NOTHING;
