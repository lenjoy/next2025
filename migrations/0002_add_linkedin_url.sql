-- Add LinkedIn URL column to speakers table

ALTER TABLE speakers ADD COLUMN linkedin_url TEXT;

-- Create index for LinkedIn URL searches
CREATE INDEX IF NOT EXISTS idx_speakers_linkedin ON speakers(linkedin_url);