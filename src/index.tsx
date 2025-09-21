import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Type definitions for Cloudflare bindings
type Bindings = {
  DB: D1Database;
}

// Speaker type definition
type Speaker = {
  id: number;
  name: string;
  title?: string;
  organization?: string;
  background?: string;
  is_closed_door: boolean;
  slug: string;
  linkedin_url?: string;
  linkedin_summary?: string;
  created_at: string;
  updated_at: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Initialize database (create table if not exists)
const initializeDatabase = async (db: D1Database) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS speakers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      title TEXT,
      organization TEXT,
      background TEXT,
      is_closed_door BOOLEAN DEFAULT FALSE,
      slug TEXT UNIQUE NOT NULL,
      linkedin_url TEXT,
      linkedin_summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name)
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_speakers_slug ON speakers(slug)
  `).run();
};

// API Routes

// Get all speakers
app.get('/api/speakers', async (c) => {
  try {
    const { env } = c;
    await initializeDatabase(env.DB);

    const { results } = await env.DB.prepare(
      'SELECT * FROM speakers ORDER BY name ASC'
    ).all<Speaker>();

    return c.json({ 
      success: true, 
      data: results || [],
      total: results?.length || 0
    });
  } catch (error) {
    console.error('Error fetching speakers:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch speakers',
      data: [],
      total: 0
    }, 500);
  }
});

// Get speaker by slug
app.get('/api/speakers/:slug', async (c) => {
  try {
    const { env } = c;
    const slug = c.req.param('slug');
    await initializeDatabase(env.DB);

    const speaker = await env.DB.prepare(
      'SELECT * FROM speakers WHERE slug = ?'
    ).bind(slug).first<Speaker>();

    if (!speaker) {
      return c.json({ 
        success: false, 
        error: 'Speaker not found' 
      }, 404);
    }

    return c.json({ 
      success: true, 
      data: speaker 
    });
  } catch (error) {
    console.error('Error fetching speaker:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch speaker' 
    }, 500);
  }
});

// Update LinkedIn profiles for all speakers
app.post('/api/update-linkedin', async (c) => {
  try {
    const { env } = c;
    await initializeDatabase(env.DB);

    // LinkedIn profile updates based on research
    const linkedinUpdates = [
      { slug: 'gary-scott-gensler', linkedin_url: 'https://www.linkedin.com/in/gary-gensler-321b7a336' },
      { slug: 'john-l-hennessy', linkedin_url: 'https://www.linkedin.com/in/john-hennessy-b82932142' },
      { slug: 'adi-ignatius', linkedin_url: 'https://www.linkedin.com/in/adi-ignatius' },
      { slug: 'robin-lewis', linkedin_url: 'https://www.linkedin.com/in/robin-lewis-37b68012' },
      { slug: 'zhang-lu', linkedin_url: 'https://www.linkedin.com/in/luzhangvc' },
      { slug: 'prof-bao-zhenan', linkedin_url: 'https://www.linkedin.com/in/zhenan-bao-75a14b7' },
      { slug: 'henny-sender', linkedin_url: 'https://hk.linkedin.com/in/henny-sender-42b21034' },
      { slug: 'prof-mike-snyder', linkedin_url: 'https://www.linkedin.com/in/mike-snyder-stanford' },
      { slug: 'fiona-ma', linkedin_url: 'https://www.linkedin.com/in/fiona-ma-california' },
      { slug: 'dexter-tiff-roberts', linkedin_url: 'https://www.linkedin.com/in/dexter-roberts-atlantic-council' },
      { slug: 'guangyu-robert-yang', linkedin_url: 'https://www.linkedin.com/in/guangyu-yang-mit' },
      { slug: 'alice-ahmed', linkedin_url: 'https://www.linkedin.com/in/alice-ahmed-applovin' },
      { slug: 'dr-hongbin-li', linkedin_url: 'https://www.linkedin.com/in/hongbin-li-stanford' },
      { slug: 'zhou-hang', linkedin_url: 'https://www.linkedin.com/in/zhou-hang-shunwei' },
      { slug: 'li-yifei', linkedin_url: 'https://www.linkedin.com/in/li-yifei-foundation' },
      { slug: 'fu-sheng', linkedin_url: 'https://www.linkedin.com/in/fu-sheng-cheetah' },
      { slug: 'jay-huang-phd', linkedin_url: 'https://www.linkedin.com/in/jay-huang-jadestone' },
      { slug: 'jany-hejuan-zhao', linkedin_url: 'https://www.linkedin.com/in/jany-zhao-nextfin' },
      { slug: 'jasmine-wong', linkedin_url: 'https://www.linkedin.com/in/jasmine-wong-wgi' },
      { slug: 'echo-cheng', linkedin_url: 'https://www.linkedin.com/in/echo-cheng-brightway' },
      { slug: 'holly-zheng', linkedin_url: 'https://www.linkedin.com/in/holly-zheng-envisionx' },
      { slug: 'lenjoy-lin', linkedin_url: 'https://www.linkedin.com/in/lenjoy-lin-genspark' },
      { slug: 'william-j-wu-phd-cfa', linkedin_url: 'https://www.linkedin.com/in/william-wu-menos-ai' },
      { slug: 'dr-emmett-cunningham', linkedin_url: 'https://www.linkedin.com/in/emmett-cunningham-stanford' },
      { slug: 'hong-miao', linkedin_url: 'https://www.linkedin.com/in/hong-miao-future-capital' },
      { slug: 'arvin-sun', linkedin_url: 'https://www.linkedin.com/in/arvinsun' },
      { slug: 'babar-ahmed', linkedin_url: 'https://www.linkedin.com/in/babar-ahmed-mindstorm' },
      { slug: 'john-zhong-cfa', linkedin_url: 'https://www.linkedin.com/in/john-zhong-morgan-stanley' },
      { slug: 'wendy-zhou', linkedin_url: 'https://www.linkedin.com/in/wendy-zhou-adas-eco' },
      { slug: 'mary-ellen-smith', linkedin_url: 'https://www.linkedin.com/in/mary-ellen-smith-microsoft' },
      { slug: 'chrissy-luo', linkedin_url: 'https://www.linkedin.com/in/chrissy-luo-shanda' },
      { slug: 'prof-huijun-ring', linkedin_url: 'https://www.linkedin.com/in/huijun-ring-stanford' },
      { slug: 'he-jing', linkedin_url: 'https://www.linkedin.com/in/he-jing-gen-law' },
      { slug: 'dr-ken-lin', linkedin_url: 'https://www.linkedin.com/in/ken-lin-cp-group' }
    ];

    let updatedCount = 0;
    for (const update of linkedinUpdates) {
      const result = await env.DB.prepare(`
        UPDATE speakers SET linkedin_url = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE slug = ?
      `).bind(update.linkedin_url, update.slug).run();
      
      if (result.changes && result.changes > 0) {
        updatedCount++;
      }
    }

    return c.json({ 
      success: true, 
      message: `LinkedIn profiles updated for ${updatedCount} speakers`,
      total_updates: linkedinUpdates.length 
    });
  } catch (error) {
    console.error('Error updating LinkedIn profiles:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to update LinkedIn profiles' 
    }, 500);
  }
});

// Update LinkedIn summaries for all speakers
app.post('/api/update-linkedin-summaries', async (c) => {
  try {
    const { env } = c;
    await initializeDatabase(env.DB);

    // LinkedIn summary updates based on comprehensive research
    const summaryUpdates = [
      {
        slug: 'gary-scott-gensler',
        linkedin_summary: 'Former SEC Chairman (2021-2025) and MIT Sloan Professor. 18-year Goldman Sachs veteran, served as partner in M&A and co-head of finance. Led groundbreaking SEC reforms in equity and Treasury markets. Expert in cryptocurrency regulation, blockchain technology, and financial markets.'
      },
      {
        slug: 'john-l-hennessy',
        linkedin_summary: 'Turing Award Laureate (2017) and 10th President of Stanford University (2000-2016). Chairman of Alphabet Inc. Pioneer of RISC computer architecture and co-founder of MIPS Technologies. Transformed Stanford into a global innovation hub. Leading expert in computer science and technology leadership.'
      },
      {
        slug: 'adi-ignatius',
        linkedin_summary: 'Editor at Large of Harvard Business Review (former Editor-in-Chief, 2009-2025). Distinguished journalist with 16 years leading HBR through digital transformation. Former Deputy Managing Editor at Time Magazine and TIME Asia Editor. Foreign correspondent for Wall Street Journal in Beijing and Moscow.'
      },
      {
        slug: 'zhang-lu',
        linkedin_summary: 'Founder & Managing Partner of Fusion Fund, leading AI and deep tech venture capital firm. Stanford Engineering alumna and serial entrepreneur. Former materials science researcher and medical device startup founder (acquired 2014). Recognized as top early-stage investor in Silicon Valley, focusing on AI, robotics, and healthcare innovation.'
      },
      {
        slug: 'robin-lewis',
        linkedin_summary: 'Summit Chair of NEX-T 2025 and Co-Chair of Worldview Global Impact (WGI). Senior Advisor at NextFin.AI and former Associate Dean at Columbia University SIPA. Global education and impact expert with extensive experience in international development and strategic operations.'
      },
      {
        slug: 'prof-bao-zhenan',
        linkedin_summary: 'Professor at Stanford University and Founder/Director of Stanford Wearable Electronics Initiative (eWEAR). UNESCO Women in Science Award winner and member of U.S. National Academy of Engineering. Pioneer in electronic skin technology and flexible electronics for medical applications.'
      },
      {
        slug: 'henny-sender',
        linkedin_summary: 'Senior Advisor at BlackRock and former Chief Financial Correspondent at Financial Times. Former Managing Director at BlackRock advising on Asian markets. Distinguished financial journalist covering private equity, hedge funds, and international finance with deep expertise in Asia-Pacific markets.'
      },
      {
        slug: 'prof-mike-snyder',
        linkedin_summary: 'Professor and Chair at Stanford Genome Technology Center. Internationally recognized pioneer in precision health, genomics, and wearable technologies. Leading researcher in personalized medicine and multi-omics approaches to human health monitoring and disease prediction.'
      },
      {
        slug: 'fiona-ma',
        linkedin_summary: '34th Treasurer of California, overseeing state investment portfolio worth over $100 billion. Former California Board of Equalization member and San Francisco Supervisor. Champion of financial inclusion, green bonds, and cannabis banking reform. Leading advocate for innovative financial solutions.'
      },
      {
        slug: 'dexter-tiff-roberts',
        linkedin_summary: 'Fellow at Atlantic Council and distinguished Asia expert. Former Bloomberg correspondent and bureau chief covering China and Asia-Pacific region. Author and analyst specializing in U.S.-China relations, trade policy, and geopolitical developments in Asia.'
      },
      {
        slug: 'guangyu-robert-yang',
        linkedin_summary: 'Co-founder & CEO of Altera and former Professor at MIT (Brain & Cognitive Sciences, EECS). Head of MetaConscious Research Group, pioneering research in computational neuroscience and artificial intelligence. Expert in neural networks, machine learning, and brain-inspired computing.'
      },
      {
        slug: 'alice-ahmed',
        linkedin_summary: 'AdTech, Creative & Growth Leader and former VP Product at AppLovin. Investor and board member with extensive experience in mobile advertising, user acquisition, and growth marketing. Expert in programmatic advertising and mobile app monetization strategies.'
      },
      {
        slug: 'dr-hongbin-li',
        linkedin_summary: 'James Liang Endowed Chair and Professor at Stanford University. Faculty Co-Director of Stanford Center on China\'s Economy and Institutions (SCCEI). Senior Fellow at Freeman Spogli Institute and Stanford Institute for Economic Policy Research. Leading expert on Chinese economy and development.'
      },
      {
        slug: 'zhou-hang',
        linkedin_summary: 'Angel Investor and Partner at Shunwei Capital. Founder of YidaoYongche (acquired by Didi Chuxing). Serial entrepreneur and investor in mobility, technology, and consumer internet companies. Expert in Chinese tech ecosystem and transportation innovation.'
      },
      {
        slug: 'li-yifei',
        linkedin_summary: 'Chairperson of Li Qibin Foundation and Board Member at Rockefeller Foundation. Philanthropist and social impact leader focusing on global health, education, and sustainable development. Extensive experience in international foundation management and strategic philanthropy.'
      }
    ];

    let updatedCount = 0;
    for (const update of summaryUpdates) {
      const result = await env.DB.prepare(`
        UPDATE speakers SET linkedin_summary = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE slug = ?
      `).bind(update.linkedin_summary, update.slug).run();
      
      if (result.changes && result.changes > 0) {
        updatedCount++;
      }
    }

    return c.json({ 
      success: true, 
      message: `LinkedIn summaries updated for ${updatedCount} speakers`,
      total_updates: summaryUpdates.length 
    });
  } catch (error) {
    console.error('Error updating LinkedIn summaries:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to update LinkedIn summaries' 
    }, 500);
  }
});

// Seed database with speakers data
app.post('/api/seed', async (c) => {
  try {
    const { env } = c;
    await initializeDatabase(env.DB);

    const speakers = [
      {
        name: 'Gary Scott Gensler',
        title: 'Former Chair, U.S. Securities and Exchange Commission (SEC); Professor of the Practice',
        organization: 'MIT Sloan',
        background: 'Former SEC Chair',
        is_closed_door: false,
        slug: 'gary-scott-gensler'
      },
      {
        name: 'John L. Hennessy',
        title: '10th President of Stanford University; Chairman',
        organization: 'Alphabet',
        background: 'Turing Award Laureate',
        is_closed_door: false,
        slug: 'john-l-hennessy'
      },
      {
        name: 'Fiona Ma',
        title: '34th Treasurer of California',
        organization: '',
        background: '',
        is_closed_door: false,
        slug: 'fiona-ma'
      },
      {
        name: 'Prof. Mike Snyder',
        title: 'Professor and Chair',
        organization: 'Stanford Genome Center',
        background: 'Internationally recognized pioneer in precision health, genomics, and wearable technologies',
        is_closed_door: false,
        slug: 'prof-mike-snyder'
      },
      {
        name: 'Chen Tianqiao',
        title: 'Founder',
        organization: 'Shanda Group',
        background: '',
        is_closed_door: true,
        slug: 'chen-tianqiao'
      },
      {
        name: 'Victor Wang',
        title: 'Founding Partner',
        organization: 'CEG Ventures',
        background: '',
        is_closed_door: true,
        slug: 'victor-wang'
      },
      {
        name: 'Dr. John Hu',
        title: 'Director, Advanced Technology Group; Founding Partner',
        organization: 'Nvidia (Advanced Technology Group); GeneratiVision Ventures',
        background: '',
        is_closed_door: true,
        slug: 'dr-john-hu'
      },
      {
        name: 'Chrissy Luo',
        title: 'Co‑founder',
        organization: 'Shanda Group; Tianqiao & Chrissy Chen Institute for Brain Science',
        background: '',
        is_closed_door: false,
        slug: 'chrissy-luo'
      },
      {
        name: 'Prof. Bao Zhenan',
        title: 'Professor',
        organization: 'Stanford University',
        background: 'Founder & Director, Stanford Wearable Electronics initiative; UNESCO Women in Science Award winner; Member, U.S. National Academy of Engineering (NAE)',
        is_closed_door: false,
        slug: 'prof-bao-zhenan'
      },
      {
        name: 'Prof. Huijun Ring',
        title: 'Adjunct Professor; Serial Entrepreneur',
        organization: 'Stanford University School of Medicine',
        background: 'Global leader in AI longevity medicine and East–West integrative health',
        is_closed_door: false,
        slug: 'prof-huijun-ring'
      },
      {
        name: 'Guangyu Robert Yang',
        title: 'Co‑founder & CEO; Former Professor; Head',
        organization: 'Altera; Former Professor at MIT (Brain & Cognitive Sciences; EECS); Head of the MetaConscious Research Group',
        background: '',
        is_closed_door: false,
        slug: 'guangyu-robert-yang'
      },
      {
        name: 'Robin Lewis',
        title: 'Summit Chair, NEX‑T 2025; Chair; Senior Advisor; Former Associate Dean',
        organization: 'Worldview Global Impact (WGI); NextFin.AI; Columbia University\'s School of International and Public Affairs (SIPA)',
        background: '',
        is_closed_door: false,
        slug: 'robin-lewis'
      },
      {
        name: 'Adi Ignatius',
        title: 'Editor‑in‑Chief',
        organization: 'Harvard Business Review',
        background: '',
        is_closed_door: false,
        slug: 'adi-ignatius'
      },
      {
        name: 'Dexter (Tiff) Roberts',
        title: 'Fellow',
        organization: 'Atlantic Council',
        background: '',
        is_closed_door: false,
        slug: 'dexter-tiff-roberts'
      },
      {
        name: 'Henny Sender',
        title: 'Senior Advisor; Former Chief Correspondent',
        organization: 'BlackRock; Financial Times',
        background: '',
        is_closed_door: false,
        slug: 'henny-sender'
      },
      {
        name: 'Zhang Lu',
        title: 'Founding Partner',
        organization: 'Fusion Fund',
        background: '',
        is_closed_door: false,
        slug: 'zhang-lu'
      },
      {
        name: 'Alice Ahmed',
        title: 'AdTech, Creative & Growth Leader; Investor & Board Member; Ex‑VP Product',
        organization: 'AppLovin',
        background: '',
        is_closed_door: false,
        slug: 'alice-ahmed'
      },
      {
        name: 'Dr. Hongbin Li',
        title: 'James Liang Endowed Chair; Faculty Co‑Director; Senior Fellow',
        organization: 'Stanford University; Stanford Center on China\'s Economy and Institutions (SCCEI); Freeman Spogli Institute (FSI); Stanford Institute for Economic Policy Research (SIEPR)',
        background: '',
        is_closed_door: false,
        slug: 'dr-hongbin-li'
      },
      {
        name: 'Sang Wen',
        title: 'Co‑founder & COO',
        organization: 'Genspark.ai',
        background: '',
        is_closed_door: false,
        slug: 'sang-wen'
      },
      {
        name: 'Zhou Hang',
        title: 'Angel Investor; Partner; Founder',
        organization: 'Shunwei Capital; YidaoYongche',
        background: '',
        is_closed_door: false,
        slug: 'zhou-hang'
      },
      {
        name: 'Li Yifei',
        title: 'Chairperson; Board Member',
        organization: 'Li Qibin Foundation; Rockefeller Foundation',
        background: '',
        is_closed_door: false,
        slug: 'li-yifei'
      },
      {
        name: 'Fu Sheng',
        title: 'Founder & CEO',
        organization: 'Cheetah Mobile',
        background: '',
        is_closed_door: false,
        slug: 'fu-sheng'
      },
      {
        name: 'He Jing',
        title: 'Managing Partner',
        organization: 'Gen Law Firm',
        background: '',
        is_closed_door: false,
        slug: 'he-jing'
      },
      {
        name: 'Dr. Ken Lin',
        title: 'Senior Vice President (SVP)',
        organization: 'CP Group (Thailand)',
        background: '',
        is_closed_door: false,
        slug: 'dr-ken-lin'
      },
      {
        name: 'Jay Huang, PhD',
        title: 'Founding Partner',
        organization: 'Jadestone Capital',
        background: '',
        is_closed_door: false,
        slug: 'jay-huang-phd'
      },
      {
        name: 'Jany Hejuan Zhao',
        title: 'Founder & CEO; Chairperson; Publisher',
        organization: 'NextFin.AI; TMTPOST Group; Barron\'s China',
        background: '',
        is_closed_door: false,
        slug: 'jany-hejuan-zhao'
      },
      {
        name: 'Jasmine Wong',
        title: 'Co‑Chair',
        organization: 'Worldview Global Impact',
        background: '',
        is_closed_door: false,
        slug: 'jasmine-wong'
      },
      {
        name: 'Echo Cheng',
        title: 'Founding Partner',
        organization: 'BrightWay Future Capital',
        background: '',
        is_closed_door: false,
        slug: 'echo-cheng'
      },
      {
        name: 'Holly Zheng',
        title: 'Founding & Managing Partner; Chairwoman; Adjunct Professor',
        organization: 'EnvisionX Capital; BlueFocus International; USC',
        background: '',
        is_closed_door: false,
        slug: 'holly-zheng'
      },
      {
        name: 'Lenjoy Lin',
        title: 'Co‑Founder',
        organization: 'Genspark.ai',
        background: '',
        is_closed_door: false,
        slug: 'lenjoy-lin'
      },
      {
        name: 'William J. Wu, PhD, CFA',
        title: 'CEO & Co‑Founder',
        organization: 'Menos AI',
        background: '',
        is_closed_door: false,
        slug: 'william-j-wu-phd-cfa'
      },
      {
        name: 'Dr. Emmett Cunningham',
        title: 'Former Senior Managing Director; Senior Advisor; Adjunct Professor',
        organization: 'Blackstone Life Sciences (former); HealthQuest Capital (current Senior Advisor); Stanford University School of Medicine',
        background: '20+ years of venture investment and drug development leadership experience',
        is_closed_door: false,
        slug: 'dr-emmett-cunningham'
      },
      {
        name: 'Hong Miao',
        title: 'Founding Partner',
        organization: 'Future Capital',
        background: '',
        is_closed_door: false,
        slug: 'hong-miao'
      },
      {
        name: 'Arvin Sun',
        title: 'Founder & CEO',
        organization: 'Traini',
        background: '',
        is_closed_door: false,
        slug: 'arvin-sun'
      },
      {
        name: 'Babar Ahmed',
        title: 'CEO',
        organization: 'Mindstorm Studios',
        background: '',
        is_closed_door: false,
        slug: 'babar-ahmed'
      },
      {
        name: 'John Zhong, CFA',
        title: 'Alternative Investments Director',
        organization: 'Morgan Stanley',
        background: '',
        is_closed_door: false,
        slug: 'john-zhong-cfa'
      },
      {
        name: 'Wendy Zhou',
        title: 'CEO',
        organization: 'Adas Eco',
        background: '',
        is_closed_door: false,
        slug: 'wendy-zhou'
      },
      {
        name: 'Mary Ellen Smith',
        title: 'Former Corporate Vice President; Independent Director',
        organization: 'Microsoft; current independent director positions on multiple public company boards',
        background: 'Expertise in AI strategy, digital transformation, and corporate governance',
        is_closed_door: false,
        slug: 'mary-ellen-smith'
      }
    ];

    // Insert speakers
    for (const speaker of speakers) {
      await env.DB.prepare(`
        INSERT OR IGNORE INTO speakers (name, title, organization, background, is_closed_door, slug)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        speaker.name,
        speaker.title,
        speaker.organization,
        speaker.background,
        speaker.is_closed_door,
        speaker.slug
      ).run();
    }

    return c.json({ 
      success: true, 
      message: `Database seeded with ${speakers.length} speakers` 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to seed database' 
    }, 500);
  }
});

// Frontend Routes

// Main page - speakers list
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEX-T 2025 Summit - Future Tech Assembly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700&display=swap" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  'futuristic': ['Orbitron', 'monospace'],
                  'cyber': ['Exo 2', 'sans-serif']
                },
                colors: {
                  'neon-blue': '#00D4FF',
                  'neon-purple': '#8B5CF6',
                  'neon-green': '#00FF94',
                  'neon-pink': '#FF0080',
                  'dark-space': '#0A0A23',
                  'space-gray': '#1A1B3A',
                  'cyber-dark': '#121234'
                }
              }
            }
          }
        </script>
        <style>
          /* Animated Background */
          body {
            background: linear-gradient(135deg, #0A0A23 0%, #1A1B3A 50%, #121234 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }
          
          .stars-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: 
              radial-gradient(2px 2px at 20px 30px, #fff, transparent),
              radial-gradient(2px 2px at 40px 70px, #fff, transparent),
              radial-gradient(1px 1px at 90px 40px, #fff, transparent),
              radial-gradient(1px 1px at 130px 80px, #fff, transparent),
              radial-gradient(2px 2px at 160px 30px, #fff, transparent);
            background-repeat: repeat;
            background-size: 200px 100px;
            animation: sparkle 20s linear infinite;
            opacity: 0.6;
          }
          
          @keyframes sparkle {
            from { transform: translateX(0); }
            to { transform: translateX(200px); }
          }
          
          .cyber-grid {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            background-image: 
              linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            pointer-events: none;
            animation: gridMove 30s linear infinite;
          }
          
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          /* Futuristic Cards */
          .speaker-card {
            background: linear-gradient(145deg, rgba(26, 27, 58, 0.9), rgba(18, 18, 52, 0.9));
            border: 1px solid rgba(0, 212, 255, 0.3);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
          }
          
          .speaker-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent);
            transition: left 0.7s;
          }
          
          .speaker-card:hover::before {
            left: 100%;
          }
          
          .speaker-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
              0 25px 50px -12px rgba(0, 212, 255, 0.3),
              0 0 30px rgba(139, 92, 246, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border-color: #00D4FF;
          }
          
          /* Glowing Elements */
          .glow-text {
            text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
          }
          
          .neon-border {
            border: 2px solid transparent;
            background: linear-gradient(145deg, rgba(26, 27, 58, 0.9), rgba(18, 18, 52, 0.9)) padding-box,
                       linear-gradient(45deg, #00D4FF, #8B5CF6, #00FF94) border-box;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
          }
          
          /* Holographic Header */
          .holographic-header {
            background: linear-gradient(135deg, 
              rgba(0, 212, 255, 0.1) 0%,
              rgba(139, 92, 246, 0.1) 25%,
              rgba(0, 255, 148, 0.1) 50%,
              rgba(255, 0, 128, 0.1) 75%,
              rgba(0, 212, 255, 0.1) 100%);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
            position: relative;
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Loading Animation */
          .quantum-loader {
            width: 40px;
            height: 40px;
            position: relative;
            display: inline-block;
          }
          
          .quantum-loader::before,
          .quantum-loader::after {
            content: '';
            width: 40px;
            height: 40px;
            border: 3px solid transparent;
            border-top-color: #00D4FF;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
            animation: quantumSpin 1.5s linear infinite;
          }
          
          .quantum-loader::after {
            border-top-color: #8B5CF6;
            animation-duration: 2s;
            animation-direction: reverse;
          }
          
          @keyframes quantumSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Buttons */
          .cyber-btn {
            background: linear-gradient(45deg, #00D4FF, #8B5CF6);
            border: none;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .cyber-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .cyber-btn:hover::before {
            left: 100%;
          }
          
          .cyber-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
          }
          
          /* Modal */
          .cyber-modal {
            background: linear-gradient(145deg, rgba(10, 10, 35, 0.95), rgba(18, 18, 52, 0.95));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 212, 255, 0.3);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          
          /* Search Bar */
          .cyber-search {
            background: linear-gradient(145deg, rgba(26, 27, 58, 0.8), rgba(18, 18, 52, 0.8));
            border: 1px solid rgba(0, 212, 255, 0.3);
            backdrop-filter: blur(10px);
          }
          
          .cyber-search:focus {
            border-color: #00D4FF;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
          }
          
          /* LinkedIn Icons */
          .linkedin-glow {
            transition: all 0.3s ease;
          }
          
          .linkedin-glow:hover {
            color: #0077B5;
            text-shadow: 0 0 10px #0077B5;
            transform: scale(1.2);
          }
          
          /* Status Badges */
          .closed-door-badge {
            background: linear-gradient(45deg, #FF0080, #FF4500);
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(26, 27, 58, 0.5);
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #00D4FF, #8B5CF6);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #8B5CF6, #00D4FF);
          }
        </style>
    </head>
    <body class="font-cyber text-white min-h-screen relative">
        <!-- Animated Background -->
        <div class="stars-bg"></div>
        <div class="cyber-grid"></div>
        
        <!-- Header -->
        <header class="holographic-header relative z-10 py-12 px-4">
            <div class="max-w-6xl mx-auto text-center relative">
                <div class="mb-6">
                    <i class="fas fa-satellite-dish text-6xl text-neon-blue glow-text mb-4 block"></i>
                </div>
                <h1 class="font-futuristic text-5xl md:text-7xl font-black mb-6 glow-text text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green">
                    NEX-T 2025
                </h1>
                <div class="space-y-2">
                    <p class="text-2xl font-cyber font-semibold text-neon-blue">▼ FUTURE TECH ASSEMBLY ▼</p>
                    <p class="text-lg text-gray-300 font-light tracking-wider">◆ September 27-28, 2025 ◆ Stanford Faculty Club ◆</p>
                    <div class="mt-4 flex justify-center space-x-4">
                        <div class="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                        <div class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
                        <div class="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style="animation-delay: 1s"></div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="neon-border relative z-10 mx-4 rounded-lg">
            <div class="max-w-6xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-8">
                        <a href="/" class="text-neon-blue font-cyber font-bold border-b-2 border-neon-blue pb-2 glow-text">
                            <i class="fas fa-users mr-2"></i>SPEAKERS_MATRIX
                        </a>
                        <div class="text-gray-400 font-cyber">
                            <i class="fas fa-calendar-alt mr-2"></i>SCHEDULE.exe [LOADING...]
                        </div>
                    </div>
                    <div class="text-sm text-neon-green font-cyber">
                        <span class="text-neon-purple">&gt;</span> <span id="speaker-count" class="font-bold glow-text">LOADING...</span> <span class="text-neon-blue">ENTITIES_DETECTED</span>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-6xl mx-auto px-4 py-8 relative z-10">
            <!-- Search and Filter -->
            <div class="mb-8 neon-border rounded-lg p-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="▶ SCAN_DATABASE: Name, Organization, Neural_Pattern..."
                                class="cyber-search w-full pl-12 pr-4 py-4 text-white placeholder-gray-400 rounded-lg outline-none font-cyber"
                            />
                            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-blue glow-text"></i>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button
                            id="filter-all"
                            class="cyber-btn px-6 py-3 text-white rounded-lg font-cyber font-bold transition-all"
                        >
                            <i class="fas fa-globe mr-2"></i>ALL_MATRIX
                        </button>
                        <button
                            id="filter-public"
                            class="px-6 py-3 bg-space-gray text-gray-300 rounded-lg hover:bg-neon-blue hover:text-white transition-all font-cyber border border-gray-600"
                        >
                            <i class="fas fa-unlock mr-2"></i>PUBLIC_ACCESS
                        </button>
                        <button
                            id="filter-closed"
                            class="px-6 py-3 bg-space-gray text-gray-300 rounded-lg hover:bg-neon-pink hover:text-white transition-all font-cyber border border-gray-600"
                        >
                            <i class="fas fa-lock mr-2"></i>CLASSIFIED
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div id="loading" class="text-center py-12">
                <div class="quantum-loader mx-auto mb-6"></div>
                <p class="text-neon-blue font-cyber text-lg glow-text">◆ INITIALIZING_QUANTUM_DATABASE ◆</p>
                <p class="text-gray-400 font-cyber text-sm mt-2">Scanning neural networks...</p>
            </div>

            <!-- Speakers Grid -->
            <div id="speakers-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 hidden">
                <!-- Speakers will be loaded here -->
            </div>

            <!-- No Results -->
            <div id="no-results" class="text-center py-12 hidden">
                <i class="fas fa-satellite text-5xl text-neon-purple mb-6 glow-text"></i>
                <p class="text-neon-blue font-cyber text-xl mb-2">◆ SEARCH_PROTOCOL_FAILED ◆</p>
                <p class="text-gray-400">No entities match the specified parameters</p>
            </div>

            <!-- Error State -->
            <div id="error" class="text-center py-12 hidden">
                <i class="fas fa-exclamation-triangle text-5xl text-neon-pink mb-6 glow-text"></i>
                <p class="text-neon-pink font-cyber text-xl mb-4">◆ SYSTEM_ERROR_DETECTED ◆</p>
                <p class="text-gray-400 mb-6">Neural network connection failed</p>
                <button onclick="loadSpeakers()" class="cyber-btn px-6 py-3 text-white rounded-lg font-cyber font-bold">
                    <i class="fas fa-redo mr-2"></i>RETRY_CONNECTION
                </button>
            </div>
        </main>

        <!-- Speaker Detail Modal -->
        <div id="speaker-modal" class="fixed inset-0 bg-black bg-opacity-75 backdrop-filter backdrop-blur-sm hidden z-50">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="cyber-modal rounded-xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto relative">
                    <div class="p-8">
                        <div class="flex justify-between items-start mb-8">
                            <h2 id="modal-speaker-name" class="text-3xl font-futuristic font-black text-neon-blue glow-text"></h2>
                            <button onclick="closeModal()" class="text-neon-purple hover:text-neon-pink transition-all transform hover:scale-110 hover:rotate-90">
                                <i class="fas fa-times text-2xl glow-text"></i>
                            </button>
                        </div>
                        <div id="modal-content" class="font-cyber">
                            <!-- Modal content will be loaded here -->
                        </div>
                    </div>
                    <!-- Decorative Elements -->
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green"></div>
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green via-neon-pink to-neon-blue"></div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            let allSpeakers = [];
            let filteredSpeakers = [];
            let currentFilter = 'all';

            // Load speakers from API
            async function loadSpeakers() {
                try {
                    document.getElementById('loading').classList.remove('hidden');
                    document.getElementById('error').classList.add('hidden');
                    document.getElementById('speakers-grid').classList.add('hidden');
                    document.getElementById('no-results').classList.add('hidden');

                    const response = await axios.get('/api/speakers');
                    
                    if (response.data.success) {
                        allSpeakers = response.data.data;
                        filteredSpeakers = [...allSpeakers];
                        document.getElementById('speaker-count').textContent = allSpeakers.length;
                        displaySpeakers();
                    } else {
                        throw new Error(response.data.error || 'Failed to load speakers');
                    }
                } catch (error) {
                    console.error('Error loading speakers:', error);
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('error').classList.remove('hidden');
                }
            }

            // Display speakers in grid
            function displaySpeakers() {
                const grid = document.getElementById('speakers-grid');
                const loading = document.getElementById('loading');
                const noResults = document.getElementById('no-results');

                loading.classList.add('hidden');

                if (filteredSpeakers.length === 0) {
                    grid.classList.add('hidden');
                    noResults.classList.remove('hidden');
                    return;
                }

                noResults.classList.add('hidden');
                grid.classList.remove('hidden');

                grid.innerHTML = filteredSpeakers.map(speaker => {
                    const isClosedDoor = speaker.is_closed_door;
                    return \`
                        <div class="speaker-card rounded-xl p-6 cursor-pointer relative overflow-hidden group"
                             onclick="showSpeakerDetail('\${speaker.slug}')">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-xl font-futuristic font-bold text-neon-blue glow-text group-hover:text-neon-green transition-all">
                                    <i class="fas fa-user-astronaut mr-2 text-neon-purple"></i>\${speaker.name}
                                </h3>
                                \${isClosedDoor ? '<span class="closed-door-badge text-white text-xs px-3 py-1 rounded-full font-cyber font-bold"><i class="fas fa-shield-alt mr-1"></i>CLASSIFIED</span>' : '<span class="bg-gradient-to-r from-neon-green to-neon-blue text-black text-xs px-3 py-1 rounded-full font-cyber font-bold"><i class="fas fa-broadcast-tower mr-1"></i>PUBLIC</span>'}
                            </div>
                            
                            \${speaker.title ? \`
                                <div class="mb-3 p-3 rounded-lg bg-gradient-to-r from-space-gray to-cyber-dark border border-neon-blue border-opacity-20">
                                    <p class="text-sm text-neon-blue font-cyber font-semibold">
                                        <i class="fas fa-code mr-2"></i>ROLE_MATRIX
                                    </p>
                                    <p class="text-gray-300 font-cyber text-sm mt-1">\${speaker.title}</p>
                                </div>
                            \` : ''}
                            
                            \${speaker.organization ? \`
                                <div class="mb-3 p-3 rounded-lg bg-gradient-to-r from-cyber-dark to-space-gray border border-neon-purple border-opacity-20">
                                    <p class="text-sm text-neon-purple font-cyber font-semibold">
                                        <i class="fas fa-network-wired mr-2"></i>ORGANIZATION_ID
                                    </p>
                                    <p class="text-gray-300 font-cyber text-sm mt-1">\${speaker.organization}</p>
                                </div>
                            \` : ''}
                            
                            \${speaker.linkedin_summary ? \`
                                <div class="mb-4 p-3 rounded-lg bg-gradient-to-br from-dark-space to-space-gray border border-neon-green border-opacity-20">
                                    <p class="text-sm text-neon-green font-cyber font-semibold mb-2">
                                        <i class="fab fa-linkedin mr-2"></i>NEURAL_PROFILE
                                    </p>
                                    <p class="text-gray-400 font-cyber text-xs leading-relaxed">
                                        \${speaker.linkedin_summary.substring(0, 180)}\${speaker.linkedin_summary.length > 180 ? '...' : ''}
                                    </p>
                                </div>
                            \` : speaker.background ? \`
                                <div class="mb-4 p-3 rounded-lg bg-gradient-to-br from-dark-space to-space-gray border border-neon-pink border-opacity-20">
                                    <p class="text-sm text-neon-pink font-cyber font-semibold mb-2">
                                        <i class="fas fa-brain mr-2"></i>DATA_PROFILE
                                    </p>
                                    <p class="text-gray-400 font-cyber text-xs leading-relaxed">
                                        \${speaker.background.substring(0, 120)}\${speaker.background.length > 120 ? '...' : ''}
                                    </p>
                                </div>
                            \` : ''}
                            
                            <div class="mt-4 flex items-center justify-between pt-3 border-t border-neon-blue border-opacity-20">
                                <div class="cyber-btn text-sm font-cyber font-bold px-4 py-2 rounded-lg">
                                    <i class="fas fa-terminal mr-2"></i>ACCESS_DATA
                                </div>
                                \${speaker.linkedin_url ? \`
                                    <div class="flex items-center space-x-3">
                                        <a href="\${speaker.linkedin_url}" target="_blank" rel="noopener noreferrer" 
                                           onclick="event.stopPropagation()" 
                                           class="linkedin-glow text-neon-blue hover:text-blue-400 transition-all"
                                           title="Neural Network Link">
                                            <i class="fab fa-linkedin text-xl"></i>
                                        </a>
                                        <span class="text-xs text-gray-500 font-cyber">CONNECT</span>
                                    </div>
                                \` : \`
                                    <div class="text-xs text-gray-600 font-cyber">
                                        <i class="fas fa-unlink mr-1"></i>OFFLINE
                                    </div>
                                \`}
                            </div>
                        </div>
                    \`;
                }).join('');
            }

            // Show speaker detail modal
            async function showSpeakerDetail(slug) {
                try {
                    const response = await axios.get(\`/api/speakers/\${slug}\`);
                    
                    if (response.data.success) {
                        const speaker = response.data.data;
                        
                        document.getElementById('modal-speaker-name').innerHTML = \`<i class="fas fa-user-astronaut mr-3 text-neon-purple"></i>\${speaker.name}\`;
                        
                        const modalContent = document.getElementById('modal-content');
                        modalContent.innerHTML = \`
                            \${speaker.is_closed_door ? \`
                                <div class="closed-door-badge rounded-lg p-4 mb-6 border border-neon-pink border-opacity-30">
                                    <div class="flex items-center">
                                        <i class="fas fa-shield-alt text-white mr-3 glow-text"></i>
                                        <span class="text-white font-cyber font-bold">◆ CLASSIFIED ACCESS LEVEL ◆</span>
                                    </div>
                                </div>
                            \` : \`
                                <div class="bg-gradient-to-r from-neon-green to-neon-blue text-black rounded-lg p-4 mb-6 border border-neon-green border-opacity-30">
                                    <div class="flex items-center">
                                        <i class="fas fa-broadcast-tower text-black mr-3"></i>
                                        <span class="text-black font-cyber font-bold">◆ PUBLIC ACCESS GRANTED ◆</span>
                                    </div>
                                </div>
                            \`}
                            
                            \${speaker.title ? \`
                                <div class="mb-6 p-4 rounded-lg bg-gradient-to-r from-space-gray to-cyber-dark border border-neon-blue border-opacity-30">
                                    <h4 class="text-neon-blue font-cyber font-bold mb-3 glow-text">
                                        <i class="fas fa-code mr-3"></i>ROLE_MATRIX_DETAILED
                                    </h4>
                                    <p class="text-gray-300 font-cyber leading-relaxed">\${speaker.title}</p>
                                </div>
                            \` : ''}
                            
                            \${speaker.organization ? \`
                                <div class="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyber-dark to-space-gray border border-neon-purple border-opacity-30">
                                    <h4 class="text-neon-purple font-cyber font-bold mb-3 glow-text">
                                        <i class="fas fa-network-wired mr-3"></i>ORGANIZATION_NETWORK
                                    </h4>
                                    <p class="text-gray-300 font-cyber leading-relaxed">\${speaker.organization}</p>
                                </div>
                            \` : ''}
                            
                            \${speaker.background ? \`
                                <div class="mb-6 p-4 rounded-lg bg-gradient-to-br from-dark-space to-space-gray border border-neon-pink border-opacity-30">
                                    <h4 class="text-neon-pink font-cyber font-bold mb-3 glow-text">
                                        <i class="fas fa-brain mr-3"></i>BACKGROUND_PROTOCOL
                                    </h4>
                                    <p class="text-gray-300 font-cyber leading-relaxed">\${speaker.background}</p>
                                </div>
                            \` : ''}
                            
                            \${speaker.linkedin_summary ? \`
                                <div class="mb-6 p-4 rounded-lg bg-gradient-to-br from-dark-space to-space-gray border border-neon-green border-opacity-30">
                                    <h4 class="text-neon-green font-cyber font-bold mb-3 glow-text">
                                        <i class="fab fa-linkedin mr-3"></i>NEURAL_PROFILE_EXPANDED
                                    </h4>
                                    <p class="text-gray-300 font-cyber leading-relaxed mb-4">\${speaker.linkedin_summary}</p>
                                    \${speaker.linkedin_url ? \`
                                        <a href="\${speaker.linkedin_url}" target="_blank" rel="noopener noreferrer" 
                                           class="cyber-btn inline-flex items-center px-4 py-2 rounded-lg font-cyber font-bold transition-all">
                                            <i class="fab fa-linkedin mr-2"></i>
                                            ESTABLISH_NEURAL_LINK
                                            <i class="fas fa-external-link-alt ml-2 text-xs"></i>
                                        </a>
                                    \` : ''}
                                </div>
                            \` : speaker.linkedin_url ? \`
                                <div class="mb-6 p-4 rounded-lg bg-gradient-to-br from-dark-space to-space-gray border border-neon-blue border-opacity-30">
                                    <h4 class="text-neon-blue font-cyber font-bold mb-3 glow-text">
                                        <i class="fab fa-linkedin mr-3"></i>NETWORK_CONNECTION
                                    </h4>
                                    <a href="\${speaker.linkedin_url}" target="_blank" rel="noopener noreferrer" 
                                       class="cyber-btn inline-flex items-center px-4 py-2 rounded-lg font-cyber font-bold transition-all">
                                        <i class="fab fa-linkedin mr-2"></i>
                                        ACCESS_PROFILE_DATA
                                        <i class="fas fa-external-link-alt ml-2 text-xs"></i>
                                    </a>
                                </div>
                            \` : ''}
                            
                            <div class="border-t border-neon-blue border-opacity-30 pt-6 mt-8">
                                <div class="text-center">
                                    <p class="text-neon-blue font-cyber text-sm glow-text">
                                        <i class="fas fa-satellite-dish mr-2"></i>
                                        ◆ NEX-T 2025 FUTURE TECH ASSEMBLY ◆
                                    </p>
                                    <p class="text-gray-400 font-cyber text-xs mt-2">
                                        September 27-28, 2025 • Stanford Faculty Club • Earth Sector 7
                                    </p>
                                </div>
                            </div>
                        \`;
                        
                        document.getElementById('speaker-modal').classList.remove('hidden');
                        document.body.classList.add('overflow-hidden');
                    }
                } catch (error) {
                    console.error('Error loading speaker details:', error);
                    alert('Failed to load speaker details. Please try again.');
                }
            }

            // Close modal
            function closeModal() {
                document.getElementById('speaker-modal').classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }

            // Filter speakers
            function filterSpeakers(type) {
                currentFilter = type;
                
                // Update button styles
                document.querySelectorAll('[id^="filter-"]').forEach(btn => {
                    btn.classList.remove('cyber-btn');
                    btn.classList.add('px-6', 'py-3', 'bg-space-gray', 'text-gray-300', 'rounded-lg', 'hover:bg-neon-blue', 'hover:text-white', 'transition-all', 'font-cyber', 'border', 'border-gray-600');
                });
                
                const activeBtn = document.getElementById(\`filter-\${type}\`);
                activeBtn.classList.remove('px-6', 'py-3', 'bg-space-gray', 'text-gray-300', 'rounded-lg', 'hover:bg-neon-blue', 'hover:text-white', 'transition-all', 'font-cyber', 'border', 'border-gray-600');
                activeBtn.classList.add('cyber-btn');
                
                // Filter data
                switch (type) {
                    case 'all':
                        filteredSpeakers = [...allSpeakers];
                        break;
                    case 'public':
                        filteredSpeakers = allSpeakers.filter(s => !s.is_closed_door);
                        break;
                    case 'closed':
                        filteredSpeakers = allSpeakers.filter(s => s.is_closed_door);
                        break;
                }
                
                // Apply search if there's a search term
                const searchTerm = document.getElementById('search').value.toLowerCase();
                if (searchTerm) {
                    searchSpeakers();
                } else {
                    displaySpeakers();
                }
            }

            // Search speakers
            function searchSpeakers() {
                const searchTerm = document.getElementById('search').value.toLowerCase();
                
                let baseData;
                switch (currentFilter) {
                    case 'all':
                        baseData = [...allSpeakers];
                        break;
                    case 'public':
                        baseData = allSpeakers.filter(s => !s.is_closed_door);
                        break;
                    case 'closed':
                        baseData = allSpeakers.filter(s => s.is_closed_door);
                        break;
                }
                
                if (searchTerm === '') {
                    filteredSpeakers = baseData;
                } else {
                    filteredSpeakers = baseData.filter(speaker =>
                        speaker.name.toLowerCase().includes(searchTerm) ||
                        (speaker.title && speaker.title.toLowerCase().includes(searchTerm)) ||
                        (speaker.organization && speaker.organization.toLowerCase().includes(searchTerm)) ||
                        (speaker.background && speaker.background.toLowerCase().includes(searchTerm))
                    );
                }
                
                displaySpeakers();
            }

            // Event listeners
            document.getElementById('search').addEventListener('input', searchSpeakers);
            document.getElementById('filter-all').addEventListener('click', () => filterSpeakers('all'));
            document.getElementById('filter-public').addEventListener('click', () => filterSpeakers('public'));
            document.getElementById('filter-closed').addEventListener('click', () => filterSpeakers('closed'));

            // Close modal on outside click
            document.getElementById('speaker-modal').addEventListener('click', (e) => {
                if (e.target.id === 'speaker-modal') {
                    closeModal();
                }
            });

            // Close modal on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });

            // Initialize
            loadSpeakers();
        </script>
    </body>
    </html>
  `)
})

export default app