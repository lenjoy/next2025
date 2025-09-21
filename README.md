# NEX-T 2025 Speakers Website

## Project Overview
- **Name**: NEX-T 2025 Speakers Website
- **Goal**: A comprehensive web application showcasing all speakers from the NEX-T 2025 Summit (New Era of X-Tech Summit)
- **Features**: Interactive speakers directory, detailed speaker profiles, search and filtering capabilities, responsive design

## Live URLs
- **Production**: https://23c7cb42.nex-t-2025.pages.dev
- **Production API**: https://23c7cb42.nex-t-2025.pages.dev/api/speakers
- **Development**: https://3000-i7iw780a7spdww18yxc86-6532622b.e2b.dev
- **GitHub**: https://github.com/lenjoy/next2025

## Currently Completed Features

### ✅ Fully Implemented
1. **Complete Speaker Database** - 38 speakers from NEX-T 2025 Summit stored in Cloudflare D1
2. **Interactive Speaker Grid** - Modern card-based layout with hover effects
3. **Speaker Detail Modal** - Click any speaker name to view full background information
4. **Advanced Search & Filter System**:
   - Real-time text search across names, titles, organizations, and backgrounds
   - Filter by session type: All, Public Sessions, Closed Door sessions
5. **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
6. **API Endpoints**:
   - `GET /api/speakers` - List all speakers with search/filter support
   - `GET /api/speakers/:slug` - Get individual speaker details
   - `POST /api/seed` - Initialize database with speaker data

### 🎨 User Interface Features
- Professional gradient header with event information
- Search bar with real-time filtering
- Speaker cards showing name, title, organization, and background preview
- Modal popup for detailed speaker information
- Closed door session indicators
- Loading states and error handling
- Responsive grid layout (1-3 columns based on screen size)

## Functional Entry URIs

### Frontend Routes
- `/` - Main speakers listing page with search and filters

### API Endpoints
- `GET /api/speakers` - Returns JSON array of all speakers
  - Response format: `{success: boolean, data: Speaker[], total: number}`
- `GET /api/speakers/:slug` - Returns single speaker details by slug
  - Example: `/api/speakers/john-l-hennessy`
  - Response format: `{success: boolean, data: Speaker}`
- `POST /api/seed` - Seeds database with speaker data (development only)
  - Response format: `{success: boolean, message: string}`

### Speaker Data Model
```javascript
{
  id: number,
  name: string,
  title: string,
  organization: string,
  background: string,
  is_closed_door: boolean,
  slug: string,
  created_at: string,
  updated_at: string
}
```

## Data Architecture

### **Database**: Cloudflare D1 SQLite
- **speakers** table with full speaker information
- Indexed on name, slug, organization for fast queries
- Local development uses SQLite with --local flag

### **Storage Services Used**:
- **Cloudflare D1**: Primary database for speaker information
- **Cloudflare Pages**: Static asset hosting and edge deployment
- **Cloudflare Workers**: API endpoints and server-side logic

### **Data Flow**:
1. Speaker data collected from NEX-T 2025 official sources
2. Stored in structured format in D1 database
3. API endpoints serve data to frontend via REST API
4. Frontend renders interactive speaker cards and detail modals
5. Real-time search/filter implemented client-side for performance

## Database Verification ✅

### **Production Database Status**
- **Total Speakers**: 38 speakers confirmed in Cloudflare D1
- **Public Sessions**: 35 speakers  
- **Closed Door Sessions**: 3 speakers
- **Database Size**: 0.06 MB
- **Last Seeded**: September 21, 2025

### **Closed Door Sessions** (3 speakers)
- Chen Tianqiao (Founder, Shanda Group)
- Victor Wang (Founding Partner, CEG Ventures)  
- Dr. John Hu (Director, Nvidia Advanced Technology Group)

### **Prominent Public Speakers** (35 speakers)
- **Gary Scott Gensler** - Former SEC Chair, MIT Sloan Professor
- **John L. Hennessy** - 10th President of Stanford, Chairman of Alphabet, Turing Award Laureate
- **Prof. Bao Zhenan** - Stanford University, UNESCO Women in Science Award winner
- **Adi Ignatius** - Editor-in-Chief, Harvard Business Review
- **Robin Lewis** - Summit Chair, NEX-T 2025
- And many more industry leaders from AI, FinTech, and technology sectors

## User Guide

### **For Visitors**:
1. **Browse Speakers**: Visit the main page to see all 38 NEX-T 2025 speakers
2. **Search**: Use the search bar to find speakers by name, company, or background
3. **Filter**: Use filter buttons to show All, Public Sessions, or Closed Door sessions only  
4. **View Details**: Click any speaker's name to open detailed background information
5. **Responsive**: Works on all devices - desktop, tablet, and mobile

### **For Developers**:
1. **API Access**: Use REST endpoints to integrate speaker data into other applications
2. **Local Development**: Uses Cloudflare D1 local mode with SQLite for development
3. **Database Seeding**: POST to `/api/seed` to initialize speaker data
4. **Real-time Search**: Frontend implements client-side filtering for instant results

## Technical Architecture

### **Tech Stack**
- **Backend**: Hono Framework (TypeScript)
- **Database**: Cloudflare D1 (SQLite-based)
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Deployment**: Cloudflare Pages + Workers
- **Development**: Wrangler CLI, PM2 process manager

### **Key Dependencies**
- `hono` - Lightweight web framework
- `@hono/vite-cloudflare-pages` - Cloudflare Pages integration
- `wrangler` - Cloudflare development and deployment CLI

## Deployment Status

### **Current Status**: ✅ Production Deployed + Development Environment
- **Production**: Live on Cloudflare Pages at https://23c7cb42.nex-t-2025.pages.dev
- **Development**: Running locally on PM2 with hot reload
- **Database**: Cloudflare D1 production database with migrations applied
- **Project**: nex-t-2025 on Cloudflare Pages
- **Last Updated**: September 21, 2025

### **Deployment Complete**:
- ✅ Code deployed to Cloudflare Pages
- ✅ Production D1 database created and configured  
- ✅ Database migrations applied to production
- ✅ Cloudflare Workers runtime configured
- ✅ Database seeded with all 38 NEX-T 2025 speakers

## Development Commands

```bash
# Development
npm run build                    # Build for production
npm run dev:sandbox             # Start local development server
pm2 start ecosystem.config.cjs  # Start with PM2 (recommended)

# Database
npm run db:migrate:local        # Apply migrations locally
npm run db:seed                 # Seed with speaker data
npm run db:reset               # Reset local database

# Deployment
npm run deploy                  # Deploy to Cloudflare Pages
```

## Event Information

**NEX-T 2025 Summit - The New Era of X-Tech Summit**
- **Date**: September 27-28, 2025
- **Location**: Stanford Faculty Club, Stanford, CA  
- **Attendees**: 400+ global leaders in technology and innovation
- **Focus**: AI, Technology, and the Future of Business
- **Organizers**: NextFin.AI and GALA

This website serves as the comprehensive speaker directory for this prestigious technology summit bringing together industry leaders, academic experts, and innovation pioneers.