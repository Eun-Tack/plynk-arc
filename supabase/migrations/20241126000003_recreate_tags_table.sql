-- Drop existing tags table if exists (recreate with proper structure)
DROP TABLE IF EXISTS resource_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;

-- Tags table for user-defined tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique tag name per user
CREATE UNIQUE INDEX idx_tags_user_name ON tags(user_id, name);
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Resource-Tag junction table
CREATE TABLE resource_tags (
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

CREATE INDEX idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag ON resource_tags(tag_id);

-- Add content_type to resources (Article, Video, Tool, etc.)
ALTER TABLE resources ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'article';

-- RLS Policies for tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for resource_tags
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resource tags"
  ON resource_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM resources
      WHERE resources.id = resource_tags.resource_id
      AND resources.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own resource tags"
  ON resource_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM resources
      WHERE resources.id = resource_tags.resource_id
      AND resources.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own resource tags"
  ON resource_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM resources
      WHERE resources.id = resource_tags.resource_id
      AND resources.user_id = auth.uid()
    )
  );
