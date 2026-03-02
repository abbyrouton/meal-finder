# Database Schema

Uses Supabase (PostgreSQL) for data storage and authentication.

---

## Tables

### users

Synced with Supabase Auth. A matching profile row is created on sign up.

```
users
├── id          UUID        PRIMARY KEY (from Supabase Auth)
├── email       TEXT        UNIQUE, NOT NULL
├── name        TEXT
├── avatar_url  TEXT
└── created_at  TIMESTAMP   DEFAULT now()
```

### recipes

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

### ratings

One rating per user per recipe. Re-rating updates the existing row.

```
ratings
├── id          UUID        PRIMARY KEY DEFAULT gen_random_uuid()
├── user_id     UUID        FOREIGN KEY → users.id (ON DELETE CASCADE)
├── recipe_id   UUID        FOREIGN KEY → recipes.id (ON DELETE CASCADE)
├── score       INTEGER     CHECK (score >= 1 AND score <= 5)
├── notes       TEXT        (optional personal tasting note)
└── created_at  TIMESTAMP   DEFAULT now()

UNIQUE CONSTRAINT on (user_id, recipe_id)
```

### cuisine_types

A controlled reference list so cuisine tags stay consistent across the app.

```
cuisine_types
├── id    UUID   PRIMARY KEY DEFAULT gen_random_uuid()
└── name  TEXT   UNIQUE, NOT NULL
```

**Seed values:** Italian, Mexican, Asian, American, Mediterranean, Indian, French, Japanese, Greek, Middle Eastern

---

## Relationships

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

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │  cuisine_types  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ email           │       │ name            │
│ name            │       └─────────────────┘
│ avatar_url      │               │
│ created_at      │               │ (referenced by)
└────────┬────────┘               │
         │                        │
         │ 1:many                 │
         ▼                        ▼
┌─────────────────┐       ┌───────────────┐
│    recipes      │       │               │
├─────────────────┤       │               │
│ id (PK)         │◄──────┤               │
│ user_id (FK)    │       │               │
│ title           │       │               │
│ cuisine_type    │───────┘               │
│ ...             │                       │
└────────┬────────┘                       │
         │                                │
         │ 1:1 (per user)                 │
         ▼                                │
┌─────────────────┐                       │
│    ratings      │                       │
├─────────────────┤                       │
│ id (PK)         │                       │
│ user_id (FK)    │───────────────────────┘
│ recipe_id (FK)  │
│ score           │
│ notes           │
│ created_at      │
└─────────────────┘
```

---

## Related Documentation

- [Project Proposal](./project-proposal.md) — The what and why
- [Architecture](./architecture.md) — Pages, navigation flow, and API design
