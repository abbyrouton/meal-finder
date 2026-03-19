package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Rating struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	RecipeID  string    `json:"recipe_id"`
	Score     int       `json:"score"`
	Notes     *string   `json:"notes"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateRatingInput struct {
	Score int     `json:"score" binding:"required,min=1,max=5"`
	Notes *string `json:"notes"`
}

type RatingHandler struct {
	db *sql.DB
}

func NewRatingHandler(db *sql.DB) *RatingHandler {
	return &RatingHandler{db: db}
}

func (h *RatingHandler) CreateRating(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	var input CreateRatingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify recipe exists and belongs to user
	var exists bool
	err := h.db.QueryRow(`SELECT EXISTS(SELECT 1 FROM recipes WHERE id = $1 AND user_id = $2)`, recipeID, userID).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify recipe"})
		return
	}
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	// Upsert rating (one rating per user per recipe)
	var r Rating
	err = h.db.QueryRow(`
		INSERT INTO ratings (user_id, recipe_id, score, notes)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id, recipe_id)
		DO UPDATE SET score = $3, notes = $4, updated_at = NOW()
		RETURNING id, user_id, recipe_id, score, notes, created_at, updated_at
	`, userID, recipeID, input.Score, input.Notes).
		Scan(&r.ID, &r.UserID, &r.RecipeID, &r.Score, &r.Notes, &r.CreatedAt, &r.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create rating"})
		return
	}

	c.JSON(http.StatusOK, r)
}
