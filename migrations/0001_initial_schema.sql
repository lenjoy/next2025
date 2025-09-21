-- NEX-T 2025 Speakers Database Schema

-- Speakers table
CREATE TABLE IF NOT EXISTS speakers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  title TEXT,
  organization TEXT,
  background TEXT,
  is_closed_door BOOLEAN DEFAULT FALSE,
  slug TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name);
CREATE INDEX IF NOT EXISTS idx_speakers_slug ON speakers(slug);
CREATE INDEX IF NOT EXISTS idx_speakers_organization ON speakers(organization);
CREATE INDEX IF NOT EXISTS idx_speakers_closed_door ON speakers(is_closed_door);