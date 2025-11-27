-- Add storyline structure and action_items to syntheses table
-- This supports the new storyline-based insight format

-- Add storyline column (JSONB for flexible structure)
ALTER TABLE syntheses
ADD COLUMN IF NOT EXISTS storyline JSONB DEFAULT NULL;

-- Add action_items column
ALTER TABLE syntheses
ADD COLUMN IF NOT EXISTS action_items TEXT[] DEFAULT '{}';

-- Comment explaining the storyline structure
COMMENT ON COLUMN syntheses.storyline IS 'Storyline structure: {context: StorySection, discoveries: StorySection[], synthesis: StorySection, conclusion: StorySection}';
COMMENT ON COLUMN syntheses.action_items IS 'Actionable items derived from synthesis';

-- Create index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_syntheses_storyline ON syntheses USING GIN (storyline);
