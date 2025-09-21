-- Add LinkedIn summary field to speakers table

ALTER TABLE speakers ADD COLUMN linkedin_summary TEXT;

-- Create index for LinkedIn summary searches
CREATE INDEX IF NOT EXISTS idx_speakers_linkedin_summary ON speakers(linkedin_summary);