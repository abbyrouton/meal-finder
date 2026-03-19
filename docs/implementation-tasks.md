# Implementation Tasks

A breakdown of MVP features into specific, completable tasks (1-2 hours each).

---

## Phase 0: Foundation (Prerequisites)

| # | Task | Description |
|---|------|-------------|
| 0.1 | **Set up Supabase project** | Create Supabase project, get API keys, add env variables to `.env.local` |
| 0.2 | **Create database tables** | Run SQL to create `users`, `recipes`, `ratings`, `cuisine_types` tables with seed data |
| 0.3 | **Install Supabase client** | Add `@supabase/supabase-js`, create client utility, set up auth helpers |
| 0.4 | **Build app layout** | Create navbar with logo, nav links, and auth status. Add layout wrapper |
| 0.5 | **Build sign-up page** | `/signup` form with email/password, Supabase auth integration, redirect on success |
| 0.6 | **Build login page** | `/login` form with email/password, error handling, redirect to dashboard |
| 0.7 | **Add auth middleware** | Protect routes, redirect unauthenticated users to `/login` |

---

## Feature 1: Recipe Library

| # | Task | Description |
|---|------|-------------|
| 1.1 | **Build recipe card component** | Reusable card showing photo, title, cuisine type, and rating stars |
| 1.2 | **Build recipe library page** | `/recipes` grid of recipe cards, fetch from Supabase |
| 1.3 | **Add recipe filters** | Dropdown for cuisine type, filter recipes client-side or via query |
| 1.4 | **Build add recipe form** | `/recipes/new` form with all fields (title, cuisine, ingredients, steps, notes) |
| 1.5 | **Add photo upload** | Integrate Supabase Storage for recipe photos, preview before submit |
| 1.6 | **Create recipe API (POST)** | `/api/recipes` endpoint to insert recipe into database |
| 1.7 | **Build recipe detail page** | `/recipes/[id]` full recipe view with all content, photo, rating |
| 1.8 | **Create recipe API (GET)** | `/api/recipes/[id]` endpoint to fetch single recipe |
| 1.9 | **Build edit recipe page** | `/recipes/[id]/edit` pre-filled form, update on submit |
| 1.10 | **Create recipe API (PUT)** | `/api/recipes/[id]` endpoint to update recipe |
| 1.11 | **Add delete recipe** | Delete button on detail page, confirmation modal, API call |
| 1.12 | **Create recipe API (DELETE)** | `/api/recipes/[id]` endpoint to delete recipe |

---

## Feature 2: Ratings & Rankings

| # | Task | Description |
|---|------|-------------|
| 2.1 | **Build star rating component** | Interactive 1-5 star selector, shows current rating, clickable |
| 2.2 | **Add rating to recipe detail** | Display star component on `/recipes/[id]`, allow user to rate |
| 2.3 | **Create rating API (POST)** | `/api/recipes/[id]/rating` upsert endpoint |
| 2.4 | **Build top recipes page** | `/top-recipes` list sorted by rating (highest first) |
| 2.5 | **Add sorting to recipe library** | Sort dropdown (newest, highest rated) on `/recipes` page |

---

## Feature 3: Suggestions

| # | Task | Description |
|---|------|-------------|
| 3.1 | **Build suggestions API** | `/api/suggestions` query: find user's top-rated cuisines, return unrated/old recipes in those cuisines |
| 3.2 | **Build suggestions page** | `/suggestions` display recommended recipes with reason ("Because you love Indian...") |
| 3.3 | **Add suggestions strip to dashboard** | `/` homepage shows 3-4 suggested recipes in a horizontal scroll |

---

## Feature 4: Dashboard & Polish

| # | Task | Description |
|---|------|-------------|
| 4.1 | **Build dashboard page** | `/` shows recent recipes, top-rated preview, suggestions strip |
| 4.2 | **Add search** | Search bar on `/recipes`, filter by title, `/api/recipes/search` endpoint |
| 4.3 | **Build profile page** | `/profile` show/edit name, email; logout button |
| 4.4 | **Add loading states** | Skeleton loaders for recipe grid, detail page, forms |
| 4.5 | **Add error handling** | Toast notifications for success/error, form validation messages |

---

## Suggested Build Order

```
Phase 0 (Foundation)     → 0.1 → 0.2 → 0.3 → 0.4 → 0.5 → 0.6 → 0.7
Feature 1 (Recipes)      → 1.1 → 1.2 → 1.4 → 1.6 → 1.7 → 1.8 → 1.9 → 1.10 → 1.11 → 1.12 → 1.3 → 1.5
Feature 2 (Ratings)      → 2.1 → 2.2 → 2.3 → 2.4 → 2.5
Feature 3 (Suggestions)  → 3.1 → 3.2 → 3.3
Feature 4 (Dashboard)    → 4.1 → 4.2 → 4.3 → 4.4 → 4.5
```

---

## Summary

| Phase | Tasks | Est. Hours |
|-------|-------|------------|
| Phase 0: Foundation | 7 | 7-14 |
| Feature 1: Recipe Library | 12 | 12-24 |
| Feature 2: Ratings & Rankings | 5 | 5-10 |
| Feature 3: Suggestions | 3 | 3-6 |
| Feature 4: Dashboard & Polish | 5 | 5-10 |
| **Total** | **32** | **32-64** |

---

## Related Documentation

- [Project Proposal](./project-proposal.md) — The what and why
- [Architecture](./architecture.md) — Pages, navigation flow, and API design
- [Database Schema](./database-schema.md) — Tables and relationships
