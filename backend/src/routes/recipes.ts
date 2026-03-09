import { Router } from 'express';

const router = Router();

// Placeholder recipes data
const recipes: Array<{ id: string; title: string; cuisine: string }> = [];

// GET /api/recipes - List all recipes
router.get('/', (_req, res) => {
  res.json({ recipes });
});

// GET /api/recipes/:id - Get a single recipe
router.get('/:id', (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  res.json(recipe);
});

// POST /api/recipes - Create a new recipe
router.post('/', (req, res) => {
  const { title, cuisine } = req.body;
  const newRecipe = {
    id: crypto.randomUUID(),
    title,
    cuisine,
  };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// PUT /api/recipes/:id - Update a recipe
router.put('/:id', (req, res) => {
  const index = recipes.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  recipes[index] = { ...recipes[index], ...req.body };
  res.json(recipes[index]);
});

// DELETE /api/recipes/:id - Delete a recipe
router.delete('/:id', (req, res) => {
  const index = recipes.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  recipes.splice(index, 1);
  res.status(204).send();
});

export default router;
