-- LinkedIn URL Fixes for NEX-T 2025 Speakers
-- This file contains corrections for LinkedIn URLs that were not working properly

-- Alice Ahmed - Correct LinkedIn profile is 'aliceliuahmed' not 'alice-ahmed-applovin'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/aliceliuahmed'
WHERE slug = 'alice-ahmed';

-- Babar Ahmed - Correct LinkedIn profile is 'babarahmed' not 'babar-ahmed-mindstorm'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/babarahmed'
WHERE slug = 'babar-ahmed';

-- Dr. Emmett Cunningham - Correct LinkedIn profile is 'emmett-cunningham-6b6a9950' not 'emmett-cunningham-stanford'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/emmett-cunningham-6b6a9950'
WHERE slug = 'dr-emmett-cunningham';

-- Holly Zheng - Correct LinkedIn profile is 'hollyzheng' not 'holly-zheng-envisionx'  
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/hollyzheng'
WHERE slug = 'holly-zheng';

-- Verify all updated URLs
SELECT name, slug, linkedin_url 
FROM speakers 
WHERE slug IN ('alice-ahmed', 'babar-ahmed', 'dr-emmett-cunningham', 'holly-zheng');