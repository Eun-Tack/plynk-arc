-- ============================================
-- plynk barcs Database Schema
-- PostgreSQL (Supabase)
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================

-- UUID 생성
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pg_cron (스케줄링)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Full-text search 
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
  occupation TEXT, -- 직업군
  
  -- 구독 정보
  subscription_tier subscription_tier DEFAULT 'free',
  arc_limit INT DEFAULT 2, -- 무료: 2개
  
  -- Daily 요약 설정
  daily_summary_enabled BOOLEAN DEFAULT true,
  daily_summary_time TIME DEFAULT '09:00:00', -- 사용자 설정 시간
  daily_summary_min_count INT DEFAULT 3, -- 최소 자료 개수
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 3.2 Arcs (프로젝트/주제별 지식 컨테이너)
CREATE TABLE arcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  goal TEXT, -- 목표 설명
  icon TEXT DEFAULT '⌒', -- 이모지 or 경로
  color TEXT DEFAULT '#3B82F6', -- Hex color
  
  -- 공유 설정
  is_public BOOLEAN DEFAULT false, -- 읽기 전용 공유
  share_token UUID DEFAULT gen_random_uuid(), -- 공유 링크용
  
  -- Synthesis 자동 트리거 설정
  auto_synthesis_enabled BOOLEAN DEFAULT true,
  auto_synthesis_threshold INT DEFAULT 10, -- N개 자료마다
  
  -- 메타데이터
  resource_count INT DEFAULT 0, -- 자료 개수 (캐시)
  last_synthesis_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT name_not_empty CHECK (char_length(name) > 0)
);

-- 3.3 Resources (자료)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arc_id UUID NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- URL 또는 파일 (둘 중 하나 필수)
  url TEXT,                    -- 웹 URL
  file_url TEXT,               -- Supabase Storage URL
  file_name TEXT,              -- 원본 파일명 (예: "research-paper.pdf")
  file_size BIGINT,            -- 파일 크기 (bytes)
  mime_type TEXT,              -- MIME 타입 (application/pdf, image/png 등)
  
  -- 기본 정보
  title TEXT NOT NULL,
  summary TEXT,                -- AI 생성 요약
  content TEXT,                -- 전체 내용 (검색용)
  
  -- AI 자동 분류
  category TEXT,               -- AI 추천 카테고리
  
  -- 메타데이터
  favicon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- 전문 검색용 (tsvector)
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(content, '')), 'B')
  ) STORED,
  
  -- 제약: URL 또는 파일 중 하나는 필수
  CONSTRAINT url_or_file_required CHECK (
    url IS NOT NULL OR file_url IS NOT NULL
  ),
  
  -- URL 중복 방지 (같은 Arc 내, URL이 있는 경우만)
  CONSTRAINT unique_url_per_arc UNIQUE NULLS NOT DISTINCT (arc_id, url)
);

-- 3.4 Tags (태그)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT unique_tag_per_user UNIQUE (user_id, name)
);

-- 3.5 Link-Tags (Many-to-Many)
CREATE TABLE link_tags (
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  PRIMARY KEY (resource_id, tag_id)
);

-- 3.6 Synthesis History (분석 기록)
CREATE TABLE synthesis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arc_id UUID NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- 분석 범위
  resource_count INT NOT NULL, -- 분석한 자료 개수
  date_range_start TIMESTAMPTZ,
  date_range_end TIMESTAMPTZ,
  
  -- AI 생성 결과
  summary TEXT, -- 전체 요약
  insights JSONB, -- ["인사이트1", "인사이트2", ...]
  patterns JSONB, -- 발견된 패턴
  
  -- 테이블 데이터
  table_schema JSONB, -- { columns: ["제목", "날짜", ...] }
  table_data JSONB, -- [{ "제목": "...", "날짜": "..." }, ...]
  
  -- 메타데이터
  status synthesis_status DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT positive_resource_count CHECK (resource_count > 0)
);

-- 3.7 Daily Summaries (일일 요약)
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  arc_id UUID REFERENCES arcs(id) ON DELETE CASCADE, -- NULL = 전체 Arc
  
  date DATE NOT NULL,
  resource_count INT NOT NULL,
  
  summary TEXT NOT NULL, -- AI 생성 요약
  key_findings JSONB, -- ["발견1", "발견2", ...]
  recommended_actions JSONB, -- ["액션1", "액션2"]
  
  -- 발송 상태
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT unique_daily_summary UNIQUE (user_id, arc_id, date)
);

-- 3.8 Notifications (앱 내 알림)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL, -- 'daily_summary', 'synthesis_ready', 'arc_limit'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- 링크 (클릭 시 이동)
  link_url TEXT,
  
  -- 읽음 상태
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. INDEXES
-- ============================================

-- 4.1 User Profiles
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- 4.2 Arces
CREATE INDEX idx_arcs_user ON arcs(user_id, created_at DESC);
CREATE INDEX idx_arcs_share_token ON arcs(share_token) WHERE is_public = true;

-- 4.3 Resources (시계열)
CREATE INDEX idx_resources_arc_timeline ON resources(arc_id, created_at DESC);
CREATE INDEX idx_resources_user_timeline ON resources(user_id, created_at DESC);
CREATE INDEX idx_resources_category ON resources(arc_id, category);

-- 4.4 Tags
CREATE INDEX idx_tags_user ON tags(user_id);
CREATE INDEX idx_link_tags_resource ON link_tags(resource_id);
CREATE INDEX idx_link_tags_tag ON link_tags(tag_id);

-- 4.5 Synthesis History
CREATE INDEX idx_synthesis_arc ON synthesis_history(arc_id, created_at DESC);
CREATE INDEX idx_synthesis_user ON synthesis_history(user_id, created_at DESC);

-- 4.6 Daily Summaries
CREATE INDEX idx_daily_summaries_user_date ON daily_summaries(user_id, date DESC);
CREATE INDEX idx_daily_summaries_pending_email ON daily_summaries(user_id) 
  WHERE email_sent = false;

-- 4.7 Notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC) 
  WHERE is_read = false;

-- ============================================
-- 5. FULL-TEXT SEARCH 
-- ============================================

-- FTS 컬럼 추가
ALTER TABLE resources 
  ADD COLUMN fts tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(title, '') || ' ' || 
      coalesce(summary, '') || ' ' || 
      coalesce(content, '')
    )
  ) STORED;

-- GIN 인덱스 (검색 성능)
CREATE INDEX idx_resources_fts ON resources USING GIN(fts);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- 6.1 User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6.2 Arces
ALTER TABLE arcs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own arcs" ON arcs
  FOR SELECT USING (
    auth.uid() = user_id 
    OR is_public = true -- 공유된 Arc
  );

CREATE POLICY "Users can insert own arcs" ON arcs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own arcs" ON arcs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own arcs" ON arcs
  FOR DELETE USING (auth.uid() = user_id);

-- 6.3 Resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resources" ON resources
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM arcs 
      WHERE arcs.id = resources.arc_id 
      AND arcs.is_public = true
    )
  );

CREATE POLICY "Users can insert own resources" ON resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources" ON resources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources" ON resources
  FOR DELETE USING (auth.uid() = user_id);

-- 6.4 Tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

-- 6.5 Link Tags
ALTER TABLE link_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own link_tags" ON link_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resources 
      WHERE resources.id = link_tags.resource_id 
      AND resources.user_id = auth.uid()
    )
  );

-- 6.6 Synthesis History
ALTER TABLE synthesis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own synthesis" ON synthesis_history
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM arcs 
      WHERE arcs.id = synthesis_history.arc_id 
      AND arcs.is_public = true
    )
  );

CREATE POLICY "Users can insert own synthesis" ON synthesis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6.7 Daily Summaries
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own summaries" ON daily_summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries" ON daily_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6.8 Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 7. FUNCTIONS & TRIGGERS
-- ============================================

-- 7.1 Updated_at 자동 갱신
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

-- 7.2 Arc resource_count 자동 업데이트
CREATE OR REPLACE FUNCTION update_arc_resource_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE arcs 
    SET resource_count = resource_count + 1,
        updated_at = now()
    WHERE id = NEW.arc_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE arcs 
    SET resource_count = GREATEST(0, resource_count - 1),
        updated_at = now()
    WHERE id = OLD.arc_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintain_arc_resource_count
  AFTER INSERT OR DELETE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_arc_resource_count();

-- 7.3 Synthesis 자동 트리거 체크
CREATE OR REPLACE FUNCTION check_synthesis_trigger()
RETURNS TRIGGER AS $$
DECLARE
  arc_threshold INT;
  current_count INT;
  box_enabled BOOLEAN;
BEGIN
  -- Arc 설정 가져오기
  SELECT 
    auto_synthesis_threshold,
    auto_synthesis_enabled,
    resource_count
  INTO 
    arc_threshold,
    box_enabled,
    current_count
  FROM arcs
  WHERE id = NEW.arc_id;
  
  -- 자동 트리거 활성화 & 임계값 도달
  IF box_enabled AND current_count >= arc_threshold THEN
    -- 알림 생성
    INSERT INTO notifications (user_id, type, title, message, link_url)
    VALUES (
      NEW.user_id,
      'synthesis_ready',
      'Synthesis Ready',
      format('You have %s resources in this box. Time to synthesize!', current_count),
      '/arcs/' || NEW.arc_id || '/synthesis'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_synthesis_trigger_on_insert
  AFTER INSERT ON resources
  FOR EACH ROW EXECUTE FUNCTION check_synthesis_trigger();

-- ============================================
-- 8. UTILITY FUNCTIONS
-- ============================================

-- 8.1 Arc 생성 제한 체크
CREATE OR REPLACE FUNCTION can_create_box(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_limit INT;
  current_count INT;
BEGIN
  SELECT arc_limit INTO user_limit
  FROM user_profiles
  WHERE id = p_user_id;
  
  SELECT COUNT(*) INTO current_count
  FROM arcs
  WHERE user_id = p_user_id;
  
  RETURN current_count < user_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.2 중복 URL 체크 (다른 Arc 포함)
CREATE OR REPLACE FUNCTION get_duplicate_urls(p_user_id UUID, p_url TEXT)
RETURNS TABLE (
  arc_id UUID,
  box_name TEXT,
  resource_id UUID,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.arc_id,
    b.name AS box_name,
    r.id AS resource_id,
    r.created_at
  FROM resources r
  JOIN arcs b ON r.arc_id = b.id
  WHERE r.user_id = p_user_id 
  AND r.url = p_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. INITIAL DATA (Seed)
-- ============================================

-- 카테고리 프리셋 (참고용)
CREATE TABLE IF NOT EXISTS category_presets (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT
);

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

-- ============================================
-- 10. CRON JOBS (pg_cron)
-- ============================================

-- Daily Summary 발송 (매일 사용자별 설정 시간)
-- 실제 구현은 Edge Function에서 처리
SELECT cron.schedule(
  'daily-summary-dispatcher',
  '*/5 * * * *', -- 5분마다 체크 (정확한 시간 매칭)
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_function_url') || '/functions/v1/daily-summary-dispatcher',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
    )
  );
  $$
);

-- ============================================
-- 11. VIEWS (편의성)
-- ============================================

-- 사용자별 통계 뷰
CREATE VIEW user_stats AS
SELECT 
  up.id AS user_id,
  up.full_name,
  COUNT(DISTINCT b.id) AS box_count,
  COUNT(r.id) AS total_resources,
  COUNT(DISTINCT t.id) AS tag_count,
  MAX(r.created_at) AS last_resource_at
FROM user_profiles up
LEFT JOIN arcs b ON up.id = b.user_id
LEFT JOIN resources r ON up.id = r.user_id
LEFT JOIN tags t ON up.id = t.user_id
GROUP BY up.id, up.full_name;

-- Arc 상세 정보 뷰
CREATE VIEW box_details AS
SELECT 
  b.id,
  b.name,
  b.goal,
  b.icon,
  b.color,
  b.resource_count,
  b.user_id,
  up.full_name AS owner_name,
  COUNT(DISTINCT sh.id) AS synthesis_count,
  MAX(sh.created_at) AS last_synthesis_at
FROM arcs b
JOIN user_profiles up ON b.user_id = up.id
LEFT JOIN synthesis_history sh ON b.id = sh.arc_id
GROUP BY b.id, b.name, b.goal, b.icon, b.color, b.resource_count, b.user_id, up.full_name;

-- ============================================
-- SCHEMA VERSION
-- ============================================

CREATE TABLE schema_version (
  version INT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO schema_version (version) VALUES (1);
