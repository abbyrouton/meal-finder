package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Recipe struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Title       string    `json:"title"`
	CuisineType string    `json:"cuisine_type"`
	Ingredients []string  `json:"ingredients"`
	Steps       []string  `json:"steps"`
	PhotoURL    *string   `json:"photo_url"`
	Notes       *string   `json:"notes"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateRecipeInput struct {
	Title       string   `json:"title" binding:"required"`
	CuisineType string   `json:"cuisine_type" binding:"required"`
	Ingredients []string `json:"ingredients" binding:"required"`
	Steps       []string `json:"steps" binding:"required"`
	PhotoURL    *string  `json:"photo_url"`
	Notes       *string  `json:"notes"`
}

type UpdateRecipeInput struct {
	Title       *string  `json:"title"`
	CuisineType *string  `json:"cuisine_type"`
	Ingredients []string `json:"ingredients"`
	Steps       []string `json:"steps"`
	PhotoURL    *string  `json:"photo_url"`
	Notes       *string  `json:"notes"`
}

type RecipeHandler struct {
	db *sql.DB
}

func NewRecipeHandler(db *sql.DB) *RecipeHandler {
	return &RecipeHandler{db: db}
}

func (h *RecipeHandler) GetRecipes(c *gin.Context) {
	userID := c.GetString("userID")

	rows, err := h.db.Query(`
		SELECT id, user_id, title, cuisine_type, ingredients, steps, photo_url, notes, created_at, updated_at
		FROM recipes
		WHERE user_id = $1
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recipes"})
		return
	}
	defer rows.Close()

	recipes := []Recipe{}
	for rows.Next() {
		var r Recipe
		var ingredients, steps []byte
		err := rows.Scan(&r.ID, &r.UserID, &r.Title, &r.CuisineType, &ingredients, &steps, &r.PhotoURL, &r.Notes, &r.CreatedAt, &r.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan recipe"})
			return
		}
		r.Ingredients = parsePostgresArray(ingredients)
		r.Steps = parsePostgresArray(steps)
		recipes = append(recipes, r)
	}

	c.JSON(http.StatusOK, recipes)
}

func (h *RecipeHandler) GetRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	var r Recipe
	var ingredients, steps []byte
	err := h.db.QueryRow(`
		SELECT id, user_id, title, cuisine_type, ingredients, steps, photo_url, notes, created_at, updated_at
		FROM recipes
		WHERE id = $1 AND user_id = $2
	`, recipeID, userID).Scan(&r.ID, &r.UserID, &r.Title, &r.CuisineType, &ingredients, &steps, &r.PhotoURL, &r.Notes, &r.CreatedAt, &r.UpdatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recipe"})
		return
	}

	r.Ingredients = parsePostgresArray(ingredients)
	r.Steps = parsePostgresArray(steps)
	c.JSON(http.StatusOK, r)
}

func (h *RecipeHandler) CreateRecipe(c *gin.Context) {
	userID := c.GetString("userID")

	var input CreateRecipeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var r Recipe
	var ingredients, steps []byte
	err := h.db.QueryRow(`
		INSERT INTO recipes (user_id, title, cuisine_type, ingredients, steps, photo_url, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, user_id, title, cuisine_type, ingredients, steps, photo_url, notes, created_at, updated_at
	`, userID, input.Title, input.CuisineType, toPostgresArray(input.Ingredients), toPostgresArray(input.Steps), input.PhotoURL, input.Notes).
		Scan(&r.ID, &r.UserID, &r.Title, &r.CuisineType, &ingredients, &steps, &r.PhotoURL, &r.Notes, &r.CreatedAt, &r.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create recipe"})
		return
	}

	r.Ingredients = parsePostgresArray(ingredients)
	r.Steps = parsePostgresArray(steps)
	c.JSON(http.StatusCreated, r)
}

func (h *RecipeHandler) UpdateRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	var input UpdateRecipeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var r Recipe
	var ingredients, steps []byte
	err := h.db.QueryRow(`
		UPDATE recipes
		SET title = COALESCE($3, title),
			cuisine_type = COALESCE($4, cuisine_type),
			ingredients = COALESCE($5, ingredients),
			steps = COALESCE($6, steps),
			photo_url = COALESCE($7, photo_url),
			notes = COALESCE($8, notes),
			updated_at = NOW()
		WHERE id = $1 AND user_id = $2
		RETURNING id, user_id, title, cuisine_type, ingredients, steps, photo_url, notes, created_at, updated_at
	`, recipeID, userID, input.Title, input.CuisineType, toPostgresArrayNullable(input.Ingredients), toPostgresArrayNullable(input.Steps), input.PhotoURL, input.Notes).
		Scan(&r.ID, &r.UserID, &r.Title, &r.CuisineType, &ingredients, &steps, &r.PhotoURL, &r.Notes, &r.CreatedAt, &r.UpdatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update recipe"})
		return
	}

	r.Ingredients = parsePostgresArray(ingredients)
	r.Steps = parsePostgresArray(steps)
	c.JSON(http.StatusOK, r)
}

func (h *RecipeHandler) DeleteRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	result, err := h.db.Exec(`
		DELETE FROM recipes
		WHERE id = $1 AND user_id = $2
	`, recipeID, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete recipe"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Recipe deleted"})
}

// Helper functions for PostgreSQL array handling
func parsePostgresArray(data []byte) []string {
	if data == nil {
		return []string{}
	}
	// Parse PostgreSQL array format: {value1,value2,...}
	s := string(data)
	if s == "{}" || s == "" {
		return []string{}
	}
	// Remove braces
	s = s[1 : len(s)-1]
	if s == "" {
		return []string{}
	}

	var result []string
	var current string
	inQuotes := false
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c == '"' {
			inQuotes = !inQuotes
		} else if c == ',' && !inQuotes {
			result = append(result, unescapePostgresString(current))
			current = ""
		} else {
			current += string(c)
		}
	}
	if current != "" {
		result = append(result, unescapePostgresString(current))
	}
	return result
}

func unescapePostgresString(s string) string {
	// Remove surrounding quotes if present
	if len(s) >= 2 && s[0] == '"' && s[len(s)-1] == '"' {
		s = s[1 : len(s)-1]
	}
	// Unescape backslashes
	result := ""
	for i := 0; i < len(s); i++ {
		if s[i] == '\\' && i+1 < len(s) {
			i++
			result += string(s[i])
		} else {
			result += string(s[i])
		}
	}
	return result
}

func toPostgresArray(arr []string) string {
	if len(arr) == 0 {
		return "{}"
	}
	result := "{"
	for i, s := range arr {
		if i > 0 {
			result += ","
		}
		// Escape and quote the string
		escaped := ""
		for _, c := range s {
			if c == '"' || c == '\\' {
				escaped += "\\"
			}
			escaped += string(c)
		}
		result += "\"" + escaped + "\""
	}
	result += "}"
	return result
}

func toPostgresArrayNullable(arr []string) *string {
	if arr == nil {
		return nil
	}
	result := toPostgresArray(arr)
	return &result
}
