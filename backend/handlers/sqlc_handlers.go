package handlers

import (
	"database/sql"
	"net/http"

	"meal-finder-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

// SqlcRecipeHandler uses sqlc generated queries
type SqlcRecipeHandler struct {
	queries *sqlc.Queries
}

func NewSqlcRecipeHandler(db *sql.DB) *SqlcRecipeHandler {
	return &SqlcRecipeHandler{queries: sqlc.New(db)}
}

func (h *SqlcRecipeHandler) GetRecipes(c *gin.Context) {
	userID := c.GetString("userID")

	recipes, err := h.queries.ListRecipesByUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recipes"})
		return
	}

	c.JSON(http.StatusOK, recipes)
}

func (h *SqlcRecipeHandler) GetRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	recipe, err := h.queries.GetRecipeByID(c.Request.Context(), sqlc.GetRecipeByIDParams{
		ID:     recipeID,
		UserID: userID,
	})
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recipe"})
		return
	}

	c.JSON(http.StatusOK, recipe)
}

type CreateRecipeRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description *string `json:"description"`
	Ingredients *string `json:"ingredients"`
	Steps       *string `json:"steps"`
	CuisineType *string `json:"cuisine_type"`
	PrepTime    *int32  `json:"prep_time"`
	PhotoURL    *string `json:"photo_url"`
	Notes       *string `json:"notes"`
}

func (h *SqlcRecipeHandler) CreateRecipe(c *gin.Context) {
	userID := c.GetString("userID")

	var req CreateRecipeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.queries.CreateRecipe(c.Request.Context(), sqlc.CreateRecipeParams{
		UserID:      userID,
		Title:       req.Title,
		Description: toNullString(req.Description),
		Ingredients: toNullString(req.Ingredients),
		Steps:       toNullString(req.Steps),
		CuisineType: toNullString(req.CuisineType),
		PrepTime:    toNullInt32(req.PrepTime),
		PhotoUrl:    toNullString(req.PhotoURL),
		Notes:       toNullString(req.Notes),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create recipe"})
		return
	}

	lastID, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{
		"message": "Recipe created",
		"id":      lastID,
	})
}

type UpdateRecipeRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Ingredients *string `json:"ingredients"`
	Steps       *string `json:"steps"`
	CuisineType *string `json:"cuisine_type"`
	PrepTime    *int32  `json:"prep_time"`
	PhotoURL    *string `json:"photo_url"`
	Notes       *string `json:"notes"`
}

func (h *SqlcRecipeHandler) UpdateRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	var req UpdateRecipeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.queries.UpdateRecipe(c.Request.Context(), sqlc.UpdateRecipeParams{
		ID:          recipeID,
		UserID:      userID,
		Title:       ptrToString(req.Title),
		Description: toNullString(req.Description),
		Ingredients: toNullString(req.Ingredients),
		Steps:       toNullString(req.Steps),
		CuisineType: toNullString(req.CuisineType),
		PrepTime:    toNullInt32(req.PrepTime),
		PhotoUrl:    toNullString(req.PhotoURL),
		Notes:       toNullString(req.Notes),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update recipe"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Recipe updated"})
}

func (h *SqlcRecipeHandler) DeleteRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	err := h.queries.DeleteRecipe(c.Request.Context(), sqlc.DeleteRecipeParams{
		ID:     recipeID,
		UserID: userID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete recipe"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Recipe deleted"})
}

func (h *SqlcRecipeHandler) GetRecipesSortedByRating(c *gin.Context) {
	userID := c.GetString("userID")

	recipes, err := h.queries.GetRecipesByUserSortedByRating(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recipes"})
		return
	}

	c.JSON(http.StatusOK, recipes)
}

// SqlcRatingHandler uses sqlc generated queries
type SqlcRatingHandler struct {
	queries *sqlc.Queries
}

func NewSqlcRatingHandler(db *sql.DB) *SqlcRatingHandler {
	return &SqlcRatingHandler{queries: sqlc.New(db)}
}

type UpsertRatingRequest struct {
	Score int32   `json:"score" binding:"required,min=1,max=5"`
	Notes *string `json:"notes"`
}

func (h *SqlcRatingHandler) CreateRating(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	var req UpsertRatingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.queries.UpsertRating(c.Request.Context(), sqlc.UpsertRatingParams{
		UserID:   userID,
		RecipeID: recipeID,
		Score:    req.Score,
		Notes:    toNullString(req.Notes),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save rating"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rating saved"})
}

func (h *SqlcRatingHandler) DeleteRating(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	err := h.queries.DeleteRating(c.Request.Context(), sqlc.DeleteRatingParams{
		UserID:   userID,
		RecipeID: recipeID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete rating"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rating deleted"})
}

// SqlcSuggestionHandler uses sqlc generated queries
type SqlcSuggestionHandler struct {
	queries *sqlc.Queries
}

func NewSqlcSuggestionHandler(db *sql.DB) *SqlcSuggestionHandler {
	return &SqlcSuggestionHandler{queries: sqlc.New(db)}
}

func (h *SqlcSuggestionHandler) GetSuggestions(c *gin.Context) {
	userID := c.GetString("userID")

	suggestions, err := h.queries.GetSuggestions(c.Request.Context(), sqlc.GetSuggestionsParams{
		UserID:   userID,
		UserID_2: userID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suggestions"})
		return
	}

	c.JSON(http.StatusOK, suggestions)
}

// Helper functions for nullable types
func toNullString(s *string) sql.NullString {
	if s == nil {
		return sql.NullString{Valid: false}
	}
	return sql.NullString{String: *s, Valid: true}
}

func toNullInt32(i *int32) sql.NullInt32 {
	if i == nil {
		return sql.NullInt32{Valid: false}
	}
	return sql.NullInt32{Int32: *i, Valid: true}
}

func ptrToString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
