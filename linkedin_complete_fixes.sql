-- Complete LinkedIn URL Fixes for ALL 38 NEX-T 2025 Speakers
-- This file adds missing LinkedIn profiles and fixes incorrect ones to achieve 100% LinkedIn coverage

-- Add missing LinkedIn profiles (4 speakers)

-- Chen Tianqiao - Add LinkedIn profile for Founder of Shanda Group
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/tianqiao-chen'
WHERE slug = 'chen-tianqiao';

-- Dr. John Hu - Add LinkedIn profile for Director, Nvidia Advanced Technology Group
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/john-hu-4189021'
WHERE slug = 'dr-john-hu';

-- Sang Wen - Add LinkedIn profile for Co-founder & COO, Genspark.ai
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/wen-sang'
WHERE slug = 'sang-wen';

-- Victor Wang - Add LinkedIn profile for Founding Partner, CEG Ventures
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/victor-wang-a4872464'
WHERE slug = 'victor-wang';

-- Fix incorrect LinkedIn profiles (2 speakers)

-- He Jing - Correct LinkedIn profile is 'jing-he-9b50b81' not 'he-jing-gen-law'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/jing-he-9b50b81'
WHERE slug = 'he-jing';

-- Lenjoy Lin - Correct LinkedIn profile is 'lenjoy' not 'lenjoy-lin-genspark'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/lenjoy'
WHERE slug = 'lenjoy-lin';

-- Verify all new and updated LinkedIn URLs
SELECT name, slug, linkedin_url 
FROM speakers 
WHERE slug IN ('chen-tianqiao', 'dr-john-hu', 'sang-wen', 'victor-wang', 'he-jing', 'lenjoy-lin')
ORDER BY name;

-- Final verification: Count all speakers with LinkedIn URLs (should be 38)
SELECT 
  COUNT(*) as total_speakers,
  COUNT(CASE WHEN linkedin_url IS NOT NULL AND linkedin_url != '' THEN 1 END) as speakers_with_linkedin,
  (COUNT(CASE WHEN linkedin_url IS NOT NULL AND linkedin_url != '' THEN 1 END) * 100.0 / COUNT(*)) as linkedin_coverage_percentage
FROM speakers;