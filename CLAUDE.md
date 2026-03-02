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
├── docs/
│   └── project-proposal.md   # Full project specification
├── README.md
└── CLAUDE.md
```

## Development Server

*Project setup not yet initialized.* When set up, development commands will be documented here.

## Architectural Decisions

### Database (Supabase)
- **users** - Synced with Supabase Auth, stores profile info
- **recipes** - Core table with user_id foreign key, stores all recipe data
- **ratings** - One rating per user per recipe (upsert pattern), 1-5 score with optional notes
- **cuisine_types** - Reference table for consistent cuisine tagging

### API Design
- RESTful endpoints under `/api/`
- Recipes: CRUD at `/api/recipes` and `/api/recipes/[id]`
- Ratings: Upsert at `/api/recipes/[id]/rating`
- Search: `/api/recipes/search?q=`
- Suggestions: `/api/suggestions`

### Pages
- Authentication: `/login`, `/signup`
- Core: `/` (dashboard), `/recipes`, `/recipes/new`, `/recipes/[id]`, `/recipes/[id]/edit`
- Discovery: `/top-recipes`, `/suggestions`
- Account: `/profile`

### MVP Scope
Focused on manual recipe entry, ratings, and basic suggestions. Deferred features include URL import, AI suggestions, sharing, meal planning, and mobile app.

## Reference

See `docs/project-proposal.md` for full specification including database schemas, API examples, and navigation flow.
