package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Suggestion struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	CuisineType string  `json:"cuisine_type"`
	PhotoURL    *string `json:"photo_url"`
	AvgRating   float64 `json:"avg_rating"`
}

type SuggestionHandler struct {
	db *sql.DB
}

func NewSuggestionHandler(db *sql.DB) *SuggestionHandler {
	return &SuggestionHandler{db: db}
}

func (h *SuggestionHandler) GetSuggestions(c *gin.Context) {
	userID := c.GetString("userID")

	// Get suggestions based on user's highest-rated cuisine types
	// 1. Find top cuisine types by average rating
	// 2. Return recipes from those cuisine types that are highly rated
	rows, err := h.db.Query(`
		WITH user_cuisine_prefs AS (
			SELECT
				r.cuisine_type,
				AVG(rt.score) as avg_score
			FROM recipes r
			JOIN ratings rt ON r.id = rt.recipe_id
			WHERE r.user_id = $1
			GROUP BY r.cuisine_type
			HAVING AVG(rt.score) >= 4
			ORDER BY avg_score DESC
			LIMIT 3
		)
		SELECT
			rec.id,
			rec.title,
			rec.cuisine_type,
			rec.photo_url,
			COALESCE(AVG(rat.score), 0) as avg_rating
		FROM recipes rec
		LEFT JOIN ratings rat ON rec.id = rat.recipe_id
		WHERE rec.user_id = $1
		AND rec.cuisine_type IN (SELECT cuisine_type FROM user_cuisine_prefs)
		GROUP BY rec.id, rec.title, rec.cuisine_type, rec.photo_url
		ORDER BY avg_rating DESC, rec.created_at DESC
		LIMIT 10
	`, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suggestions"})
		return
	}
	defer rows.Close()

	suggestions := []Suggestion{}
	for rows.Next() {
		var s Suggestion
		err := rows.Scan(&s.ID, &s.Title, &s.CuisineType, &s.PhotoURL, &s.AvgRating)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan suggestion"})
			return
		}
		suggestions = append(suggestions, s)
	}

	// If no suggestions based on cuisine preferences, return top-rated recipes
	if len(suggestions) == 0 {
		rows, err = h.db.Query(`
			SELECT
				rec.id,
				rec.title,
				rec.cuisine_type,
				rec.photo_url,
				COALESCE(AVG(rat.score), 0) as avg_rating
			FROM recipes rec
			LEFT JOIN ratings rat ON rec.id = rat.recipe_id
			WHERE rec.user_id = $1
			GROUP BY rec.id, rec.title, rec.cuisine_type, rec.photo_url
			ORDER BY avg_rating DESC, rec.created_at DESC
			LIMIT 10
		`, userID)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suggestions"})
			return
		}
		defer rows.Close()

		for rows.Next() {
			var s Suggestion
			err := rows.Scan(&s.ID, &s.Title, &s.CuisineType, &s.PhotoURL, &s.AvgRating)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan suggestion"})
				return
			}
			suggestions = append(suggestions, s)
		}
	}

	c.JSON(http.StatusOK, suggestions)
}
