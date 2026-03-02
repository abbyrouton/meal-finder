# Meal Finder

A personal recipe library for home cooks who want to save, rate, and rediscover their favourite meals.

## What It Does

Meal Finder helps you stop losing track of recipes you love. Whether you found a recipe in a cookbook, online, or from a friend, you can save it all in one place.

**Key Features:**
- **Recipe Library** — Add recipes with title, cuisine type, ingredients, steps, photos, and personal notes
- **Ratings** — Rate recipes 1-5 stars and see your all-time favourites ranked
- **Suggestions** — Get recommendations based on cuisines you rate highly

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase](https://supabase.com/) account (for database and authentication)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abbyrouton/meal-finder.git
   cd meal-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/` (coming soon)

## Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Status

This project is currently in the planning phase. See [`docs/project-proposal.md`](docs/project-proposal.md) for the full specification.

## License

MIT
