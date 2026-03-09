# Architecture

## Project Structure

```
meal-finder/
├── frontend/           # Next.js frontend app (port 3000)
│   ├── src/app/        # App router pages
│   ├── public/         # Static assets
│   └── package.json
├── backend/            # Express.js API server (port 3001)
│   ├── src/
│   │   ├── index.ts    # Server entry point
│   │   └── routes/     # API route handlers
│   └── package.json
├── docs/               # Project documentation
└── package.json        # Root monorepo scripts
```

The project uses a monorepo structure with separate frontend and backend directories:
- **Frontend**: Next.js with App Router handles UI and page routing
- **Backend**: Express.js serves the REST API on port 3001
- **Root**: Contains scripts to run both services concurrently

---

## Pages

### Authentication

| Page | URL | Purpose |
|---|---|---|
| Login | `/login` | Sign in with email and password. Gateway to the entire app — no access without it. |
| Sign Up | `/signup` | Create a new account. Only visited once per user. |

### Core App

| Page | URL | Purpose |
|---|---|---|
| Dashboard | `/` | Personal hub. Shows recent recipes, top-rated meals at a glance, and the suggestions strip. First page seen after login. |
| Recipe Library | `/recipes` | Full browsable, searchable grid of all saved recipes. Filterable by cuisine type and rating. |
| Add Recipe | `/recipes/new` | Form to manually enter a new recipe — title, cuisine, ingredients, steps, photo, notes. |
| Recipe Detail | `/recipes/[id]` | Single recipe's full page with all content, photo, and the user's star rating. |
| Edit Recipe | `/recipes/[id]/edit` | Pre-filled version of the Add Recipe form for updating an existing recipe. |

### Rankings & Suggestions

| Page | URL | Purpose |
|---|---|---|
| Top Recipes | `/top-recipes` | The user's library sorted by rating — a greatest hits view of their best meals. |
| Suggestions | `/suggestions` | Recipes recommended based on the user's highest-rated cuisine types. |

### Account

| Page | URL | Purpose |
|---|---|---|
| Profile | `/profile` | Update name, email, password, and cuisine preferences. |

---

## Navigation Flow

```
                        ┌─────────────┐
                        │   /signup   │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   /login    │
                        └──────┬──────┘
                               │
                    ┌──────────▼──────────┐
                    │    / (Dashboard)    │
                    └──┬──────┬───────┬───┘
                       │      │       │
           ┌───────────┘      │       └────────────┐
           │                  │                    │
    ┌──────▼───────┐  ┌───────▼──────┐   ┌────────▼────────┐
    │   /recipes   │  │ /top-recipes │   │  /suggestions   │
    └──┬───────┬───┘  └──────────────┘   └─────────────────┘
       │       │
       │    ┌──▼──────────────┐
       │    │  /recipes/new   │
       │    └─────────────────┘
       │
    ┌──▼───────────────┐
    │  /recipes/[id]   │
    └──┬───────────────┘
       │
    ┌──▼───────────────────┐
    │  /recipes/[id]/edit  │
    └──────────────────────┘
```

---

## API Endpoints

All API endpoints are served by the Express.js backend on port 3001. The frontend proxies requests to the backend during development.

### Recipes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/recipes` | Get all recipes with filters and sorting |
| GET | `/api/recipes/[id]` | Get a single recipe's full detail |
| POST | `/api/recipes` | Add a new recipe |
| PUT | `/api/recipes/[id]` | Update an existing recipe |
| DELETE | `/api/recipes/[id]` | Remove a recipe |

### Ratings

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/recipes/[id]/rating` | Add or update a rating (upsert) |
| DELETE | `/api/recipes/[id]/rating` | Remove a rating |

### Search

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/recipes/search?q=tikka` | Search the user's library by recipe name |

### Suggestions

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/suggestions` | Return recipe suggestions based on the user's top-rated cuisines |

---

## Request & Response Examples

**POST /api/recipes** — request body:
```json
{
  "title": "Chicken Tikka Masala",
  "cuisine_type": "Indian",
  "ingredients": "chicken, cream, tomatoes, spices",
  "steps": "1. Marinate chicken. 2. Cook sauce. 3. Combine.",
  "prep_time": 45,
  "notes": "Use less chili next time",
  "photo_url": "https://..."
}
```

**POST /api/recipes/[id]/rating** — request body:
```json
{
  "score": 4,
  "notes": "Really good but a bit salty"
}
```

**GET /api/recipes** — response:
```json
[
  {
    "id": "abc-123",
    "title": "Chicken Tikka Masala",
    "cuisine_type": "Indian",
    "photo_url": "https://...",
    "rating": 4,
    "created_at": "2026-03-01"
  }
]
```

---

## Frontend Action to Endpoint Map

| User Action | Method | Endpoint |
|---|---|---|
| View recipe list filtered by rank | GET | `/api/recipes?sort=rating` |
| Add a new recipe | POST | `/api/recipes` |
| Update a recipe's rating | POST | `/api/recipes/[id]/rating` |
| Remove a recipe | DELETE | `/api/recipes/[id]` |
| Search recipes | GET | `/api/recipes/search?q=` |

---

## Related Documentation

- [Project Proposal](./project-proposal.md) — The what and why
- [Database Schema](./database-schema.md) — Tables and relationships
