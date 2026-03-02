# Project Proposal: Meal Finder

## Overview
**Target Audience:** Home cooks and food lovers who try many recipes but struggle to keep track of what they've made and what they enjoyed.

**Problem:** People discover recipes from many sources — cookbooks, websites, friends — but have no single place to store them, and no easy way to remember which ones they loved.

**Value Proposition:** My app helps home cooks to stop losing track of recipes they enjoy by giving them a personal recipe library where they can save, rate, and rediscover their favourite meals — and get suggestions for what to cook next.

---

## Feature Scope

### Must-Have (MVP)
1. **Recipe Library** — Users can manually add, view, edit, and delete recipes with a title, cuisine type, ingredients, steps, photo, and personal notes.
2. **Ratings & Rankings** — Users can rate any recipe 1–5 stars and view their library sorted by rating to see their all-time favourites.
3. **Suggestions** — The app recommends recipes from the usesed on their highest-rated cuisine types, surfacing meals they haven't tried recently or haven't rated yet.

### Deferred (V2 and beyond)
- Import a recipe automatically from a URL
- AI-powered smart suggestions using machine learning
- Share recipes with other users
- Meal planning calendar
- Nutritional information per recipe
- Native mobile app
- Community ratings and reviews

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
| Add Recipe | `/recipes/new` | Form to manually enter a nerecipe — title, cuisine, ingredients, steps, photo, notes. |
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
                        ┌──────▼──�                          │
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
       │    ┌──▼──────────┐
       │    │ /recipes/new│
       │    └──────� Supabase Auth. A matching profile row is created on sign up.

```
users
├── id          UUID        PRIMARY KEY (from Supabase Auth)
├── email       TEXT        UNIQUE, NOT NULL
├── name        TEXT
├── avatar_url  TEXT
└── created_at  TIMESTAMP   DEFAULT now()
```

### Table 2: recipes
The core table. One row per recipe, owned by one user.

```
recipes
├── id            UUID        PRIMARY KEY DEFAULT gen_random_uuid()
├── user_id       UUID        FOREIGN KEY → users.id
├── title         TEXT        NOT NULL
├── description   TEXT
├── ingredients   TEXT
├── steps         TEXT
├── cuisine_type  TEXT
├── prep_time     INTEGER     (in minutes, optional)
├── photo_url     TEXT
├── notes         TEXT
└── created_at    TIMESTAMP   DEFAULT now()
```

### Table 3: ratings
One rating per user per recipe. Re-rating updates the existing row.

```
ratings
├── id          UUID        PRIMARY KEY DEFAULT gen_random_pes.id (ON DELETE CASCADE)
├── score       INTEGER     CHECK (score >= 1 AND score <= 5)
├── notes       TEXT        (optional personal tasting note)
└── created_at  TIMESTAMP   DEFAULT now()

UNIQUE CONSTRAINT on (user_id, recipe_id)
```

### Table 4: cuisine_types
A controlled reference list so cuisine tags stay consistent across the app.

```
cuisine_types
├── id    UUID   PRIMARY KEY DEFAULT gen_random_uuid()
└── name  TEXT   UNIQUE, NOT NULL

Seed values: Italian, Mexican, Asian, American, Mediterranean, Indian, French, Japanese, Greek, Middle Eastern
```

### Relationships

```
users
 └── has many → recipes
 └── has many → ratings

recipes
 └── belongs to → users
 └── has one    → ratings (per user)
 └── belongs to → cuisine_types

ratings
 └── belongs to → users
 └── belongs to → recipes
```

---

## API Endpoints

### Recipes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/recipes` | Get all recipes fo | Get recipes with filters and sorting |
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

### Request & Response Examples

**POST /api/recipes** — request body:
```json
{
  "title": "Chicken Tikka Masala",
  "cuisine_type": "Indian",
  "ingredients": "chicken, cream, tomatoes, spices",
  "steps": "1. Marinate chicken. 2. Cook sauce. 3. Combine.",
  "pretime": 45,
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

### Frontend Action to Endpoint Map

| User Action | Method | Endpoint |
|---|---|---|
| View recipe list filtered by rank | GET | `/api/recipes?sort=rating` |
| Add a new recipe | POST | `/api/recipes` |
| Update a recipe's rating | POST | `/api/recipes/[id]/rating` |
| Remove a recipe | DELETE | `/api/recipes/[id]` |
| Search recipes | GET | `/api/recipes/search?q=` |
