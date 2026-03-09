# Meal Finder

A personal recipe library app for home cooks to save, rate, and rediscover their favourite meals with smart suggestions based on their preferences.

## Project Overview

Meal Finder solves the problem of losing track of recipes from various sources (cookbooks, websites, friends). Users can:
- Save recipes with title, cuisine type, ingredients, steps, photo, and notes
- Rate recipes 1-5 stars and view rankings
- Get suggestions based on their highest-rated cuisine types

## Folder Structure

```
meal-finder/
├── frontend/           # Next.js frontend app
│   ├── src/app/        # App router pages and API routes
│   ├── public/         # Static assets
│   ├── package.json
│   └── [config files]
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── index.ts    # Server entry point (port 3001)
│   │   └── routes/     # API route handlers
│   ├── package.json
│   └── tsconfig.json
├── docs/               # Project documentation
│   ├── project-proposal.md
│   ├── architecture.md
│   └── database-schema.md
├── .github/workflows/  # CI/CD deployment
├── package.json        # Root monorepo scripts
├── README.md
└── CLAUDE.md
```

## Development Server

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev

# Run individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

## Architectural Decisions

### Database (Supabase)
- **users** - Synced with Supabase Auth, stores profile info
- **recipes** - Core table with user_id foreign key, stores all recipe data
- **ratings** - One rating per user per recipe (upsert pattern), 1-5 score with optional notes
- **cuisine_types** - Reference table for consistent cuisine tagging

### API Design
- Backend (Express.js): RESTful API on port 3001
  - `/api/health` - Health check
  - `/api/recipes` - CRUD operations
- Frontend (Next.js): App on port 3000
  - Uses Next.js App Router
  - Will proxy to backend for API calls

### Pages
- Authentication: `/login`, `/signup`
- Core: `/` (dashboard), `/recipes`, `/recipes/new`, `/recipes/[id]`, `/recipes/[id]/edit`
- Discovery: `/top-recipes`, `/suggestions`
- Account: `/profile`

### MVP Scope
Focused on manual recipe entry, ratings, and basic suggestions. Deferred features include URL import, AI suggestions, sharing, meal planning, and mobile app.

## Reference

See `docs/project-proposal.md` for full specification including database schemas, API examples, and navigation flow.
