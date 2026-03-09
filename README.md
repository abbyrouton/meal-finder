# Meal Finder

A personal recipe library for home cooks who want to save, rate, and rediscover their favourite meals.

## What It Does

Meal Finder helps you stop losing track of recipes you love. Whether you found a recipe in a cookbook, online, or from a friend, you can save it all in one place.

**Key Features:**
- **Recipe Library** — Add recipes with title, cuisine type, ingredients, steps, photos, and personal notes
- **Ratings** — Rate recipes 1-5 stars and see your all-time favourites ranked
- **Suggestions** — Get recommendations based on cuisines you rate highly

## Project Structure

```
meal-finder/
├── frontend/           # Next.js frontend app
│   ├── src/app/        # App router pages and API routes
│   ├── public/         # Static assets
│   └── package.json
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── index.ts    # Server entry point
│   │   └── routes/     # API route handlers
│   └── package.json
├── docs/               # Project documentation
│   ├── project-proposal.md
│   ├── architecture.md
│   └── database-schema.md
└── package.json        # Root monorepo scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [Supabase](https://supabase.com/) account (for database and authentication)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abbyrouton/meal-finder.git
   cd meal-finder
   ```

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   ```bash
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

## Running Locally

Start both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## API Endpoints

### Backend (Express.js - port 3001)

- `GET /api/health` - Health check
- `GET /api/recipes` - List all recipes
- `GET /api/recipes/:id` - Get a recipe
- `POST /api/recipes` - Create a recipe
- `PUT /api/recipes/:id` - Update a recipe
- `DELETE /api/recipes/:id` - Delete a recipe

### Frontend (Next.js - port 3000)

- `GET /api/health` - Frontend health check

## Project Status

This project is currently in the early development phase. See [`docs/project-proposal.md`](docs/project-proposal.md) for the full specification.

## License

MIT
