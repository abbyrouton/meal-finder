-- name: ListRecipesByUser :many
SELECT * FROM recipes
WHERE user_id = ?
ORDER BY created_at DESC;

-- name: GetRecipeByID :one
SELECT * FROM recipes
WHERE id = ? AND user_id = ?;

-- name: CreateRecipe :execresult
INSERT INTO recipes (id, user_id, title, description, ingredients, steps, cuisine_type, prep_time, photo_url, notes)
VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: UpdateRecipe :exec
UPDATE recipes
SET title = COALESCE(?, title),
    description = COALESCE(?, description),
    ingredients = COALESCE(?, ingredients),
    steps = COALESCE(?, steps),
    cuisine_type = COALESCE(?, cuisine_type),
    prep_time = COALESCE(?, prep_time),
    photo_url = COALESCE(?, photo_url),
    notes = COALESCE(?, notes)
WHERE id = ? AND user_id = ?;

-- name: DeleteRecipe :exec
DELETE FROM recipes
WHERE id = ? AND user_id = ?;
