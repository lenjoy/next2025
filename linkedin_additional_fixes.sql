-- Additional LinkedIn URL Fixes for NEX-T 2025 Speakers
-- This file contains corrections for additional LinkedIn URLs that were not working properly

-- Chrissy Luo - Correct LinkedIn profile is 'chrissy-luo' not 'chrissy-luo-shanda'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/chrissy-luo'
WHERE slug = 'chrissy-luo';

-- Dexter (Tiff) Roberts - Correct LinkedIn profile is 'dexter-roberts-03907231' not 'dexter-roberts-atlantic-council'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/dexter-roberts-03907231'
WHERE slug = 'dexter-tiff-roberts';

-- Dr. Hongbin Li - Correct LinkedIn profile is 'hongbin-li-62977a206' not 'hongbin-li-stanford'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/hongbin-li-62977a206'
WHERE slug = 'dr-hongbin-li';

-- Dr. Ken Lin - Correct LinkedIn profile is 'lin-boston' not 'ken-lin-cp-group'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/lin-boston'
WHERE slug = 'dr-ken-lin';

-- Echo Cheng - Correct LinkedIn profile is 'echo-cheng-5632a812' not 'echo-cheng-brightway'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/echo-cheng-5632a812'
WHERE slug = 'echo-cheng';

-- Fu Sheng - Correct LinkedIn profile is 'sheng-fu-4b49a086' not 'fu-sheng-cheetah'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/sheng-fu-4b49a086'
WHERE slug = 'fu-sheng';

-- Fiona Ma - Correct LinkedIn profile is 'fionamacpa' not 'fiona-ma-california'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/fionamacpa'
WHERE slug = 'fiona-ma';

-- Guangyu Robert Yang - Correct LinkedIn profile is 'robert-yang-41a83019' not 'guangyu-yang-mit'
UPDATE speakers 
SET linkedin_url = 'https://www.linkedin.com/in/robert-yang-41a83019'
WHERE slug = 'guangyu-robert-yang';

-- Verify all updated URLs
SELECT name, slug, linkedin_url 
FROM speakers 
WHERE slug IN ('chrissy-luo', 'dexter-tiff-roberts', 'dr-hongbin-li', 'dr-ken-lin', 'echo-cheng', 'fu-sheng', 'fiona-ma', 'guangyu-robert-yang')
ORDER BY name;