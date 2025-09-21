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
        <title>NEX-T 2025 Summit - Speakers</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .speaker-card {
            transition: all 0.3s ease;
          }
          .speaker-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
    </head>
    <body class="bg-gray-50 min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
            <div class="max-w-6xl mx-auto text-center">
                <h1 class="text-4xl font-bold mb-4">
                    <i class="fas fa-microphone-alt mr-3"></i>
                    NEX-T 2025 Summit
                </h1>
                <p class="text-xl opacity-90">The New Era of X-Tech Summit</p>
                <p class="text-lg opacity-75 mt-2">September 27-28, 2025 • Stanford Faculty Club</p>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-6xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-8">
                        <a href="/" class="text-gray-900 font-semibold border-b-2 border-blue-600 pb-2">
                            <i class="fas fa-users mr-2"></i>Speakers
                        </a>
                        <div class="text-gray-500">
                            <i class="fas fa-calendar-alt mr-2"></i>Schedule (Coming Soon)
                        </div>
                    </div>
                    <div class="text-sm text-gray-600">
                        <span id="speaker-count" class="font-semibold">Loading...</span> speakers
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-6xl mx-auto px-4 py-8">
            <!-- Search and Filter -->
            <div class="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search speakers by name, organization, or background..."
                                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button
                            id="filter-all"
                            class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            All
                        </button>
                        <button
                            id="filter-public"
                            class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Public Sessions
                        </button>
                        <button
                            id="filter-closed"
                            class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Closed Door
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div id="loading" class="text-center py-12">
                <div class="loading mx-auto mb-4"></div>
                <p class="text-gray-600">Loading speakers...</p>
            </div>

            <!-- Speakers Grid -->
            <div id="speakers-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hidden">
                <!-- Speakers will be loaded here -->
            </div>

            <!-- No Results -->
            <div id="no-results" class="text-center py-12 hidden">
                <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-600 text-lg">No speakers found matching your criteria.</p>
            </div>

            <!-- Error State -->
            <div id="error" class="text-center py-12 hidden">
                <i class="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
                <p class="text-red-600 text-lg mb-4">Failed to load speakers.</p>
                <button onclick="loadSpeakers()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Try Again
                </button>
            </div>
        </main>

        <!-- Speaker Detail Modal -->
        <div id="speaker-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 id="modal-speaker-name" class="text-2xl font-bold text-gray-900"></h2>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div id="modal-content">
                            <!-- Modal content will be loaded here -->
                        </div>
                    </div>
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
                        <div class="speaker-card bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-300 transition-all"
                             onclick="showSpeakerDetail('\${speaker.slug}')">
                            <div class="flex items-start justify-between mb-3">
                                <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                    \${speaker.name}
                                </h3>
                                \${isClosedDoor ? '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Closed Door</span>' : ''}
                            </div>
                            
                            \${speaker.title ? \`
                                <p class="text-sm text-gray-600 mb-2 font-medium">
                                    <i class="fas fa-briefcase mr-1"></i>
                                    \${speaker.title}
                                </p>
                            \` : ''}
                            
                            \${speaker.organization ? \`
                                <p class="text-sm text-blue-600 mb-3">
                                    <i class="fas fa-building mr-1"></i>
                                    \${speaker.organization}
                                </p>
                            \` : ''}
                            
                            \${speaker.background ? \`
                                <p class="text-xs text-gray-500 line-clamp-3">
                                    \${speaker.background.substring(0, 120)}\${speaker.background.length > 120 ? '...' : ''}
                                </p>
                            \` : ''}
                            
                            <div class="mt-4 text-blue-600 text-sm font-medium">
                                <i class="fas fa-arrow-right mr-1"></i>
                                View Details
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
                        
                        document.getElementById('modal-speaker-name').textContent = speaker.name;
                        
                        const modalContent = document.getElementById('modal-content');
                        modalContent.innerHTML = \`
                            \${speaker.is_closed_door ? \`
                                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <div class="flex items-center">
                                        <i class="fas fa-lock text-red-500 mr-2"></i>
                                        <span class="text-red-800 font-medium">Closed Door Session</span>
                                    </div>
                                </div>
                            \` : ''}
                            
                            \${speaker.title ? \`
                                <div class="mb-4">
                                    <h4 class="text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-briefcase mr-2"></i>Position
                                    </h4>
                                    <p class="text-gray-900">\${speaker.title}</p>
                                </div>
                            \` : ''}
                            
                            \${speaker.organization ? \`
                                <div class="mb-4">
                                    <h4 class="text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-building mr-2"></i>Organization
                                    </h4>
                                    <p class="text-blue-600 font-medium">\${speaker.organization}</p>
                                </div>
                            \` : ''}
                            
                            \${speaker.background ? \`
                                <div class="mb-4">
                                    <h4 class="text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-user mr-2"></i>Background
                                    </h4>
                                    <p class="text-gray-900 leading-relaxed">\${speaker.background}</p>
                                </div>
                            \` : ''}
                            
                            <div class="border-t border-gray-200 pt-4 mt-6">
                                <p class="text-xs text-gray-500">
                                    <i class="fas fa-calendar mr-1"></i>
                                    NEX-T 2025 Summit • September 27-28, 2025
                                </p>
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
                    btn.classList.remove('bg-blue-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                document.getElementById(\`filter-\${type}\`).classList.remove('bg-gray-200', 'text-gray-700');
                document.getElementById(\`filter-\${type}\`).classList.add('bg-blue-600', 'text-white');
                
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