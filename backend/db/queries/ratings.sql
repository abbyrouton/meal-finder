-- name: UpsertRating :exec
INSERT INTO ratings (id, user_id, recipe_id, score, notes)
VALUES (UUID(), ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE score = VALUES(score), notes = VALUES(notes);

-- name: DeleteRating :exec
DELETE FROM ratings
WHERE recipe_id = ? AND user_id = ?;

-- name: GetUserRatings :many
SELECT
  rt.id, rt.user_id, rt.recipe_id, rt.score, rt.notes, rt.created_at,
  r.title as recipe_title, r.cuisine_type as recipe_cuisine_type, r.prep_time as recipe_prep_time
FROM ratings rt
JOIN recipes r ON rt.recipe_id = r.id
WHERE rt.user_id = ?
ORDER BY rt.created_at DESC;

-- name: GetRecipesByUserSortedByRating :many
SELECT r.*, COALESCE(rt.score, 0) AS rating_score
FROM recipes r
LEFT JOIN ratings rt ON r.id = rt.recipe_id AND rt.user_id = r.user_id
WHERE r.user_id = ?
ORDER BY rating_score DESC, r.created_at DESC;

-- name: GetSuggestions :many
SELECT DISTINCT r.*
FROM recipes r
WHERE r.user_id = ?
  AND r.cuisine_type IN (
    SELECT rec.cuisine_type
    FROM recipes rec
    JOIN ratings rat ON rec.id = rat.recipe_id
    WHERE rec.user_id = ?
    GROUP BY rec.cuisine_type
    HAVING AVG(rat.score) >= 4
    ORDER BY AVG(rat.score) DESC
    LIMIT 3
  )
ORDER BY r.created_at DESC
LIMIT 10;
