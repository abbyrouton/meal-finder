package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"meal-finder-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

// RecipeResponse is a clean JSON-friendly representation of a recipe
type RecipeResponse struct {
	ID          string     `json:"id"`
	UserID      string     `json:"user_id"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Ingredients *string    `json:"ingredients"`
	Steps       *string    `json:"steps"`
	CuisineType *string    `json:"cuisine_type"`
	PrepTime    *int32     `json:"prep_time"`
	PhotoURL    *string    `json:"photo_url"`
	Notes       *string    `json:"notes"`
	CreatedAt   *time.Time `json:"created_at"`
}

// ToRecipeResponse converts a sqlc Recipe to a clean JSON response
func ToRecipeResponse(r sqlc.Recipe) RecipeResponse {
	return RecipeResponse{
		ID:          r.ID,
		UserID:      r.UserID,
		Title:       r.Title,
		Description: nullStringToPtr(r.Description),
		Ingredients: nullStringToPtr(r.Ingredients),
		Steps:       nullStringToPtr(r.Steps),
		CuisineType: nullStringToPtr(r.CuisineType),
		PrepTime:    nullInt32ToPtr(r.PrepTime),
		PhotoURL:    nullStringToPtr(r.PhotoUrl),
		Notes:       nullStringToPtr(r.Notes),
		CreatedAt:   nullTimeToPtr(r.CreatedAt),
	}
}

// ToRecipeResponses converts a slice of sqlc Recipes to clean JSON responses
func ToRecipeResponses(recipes []sqlc.Recipe) []RecipeResponse {
	result := make([]RecipeResponse, len(recipes))
	for i, r := range recipes {
		result[i] = ToRecipeResponse(r)
	}
	return result
}

func nullStringToPtr(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}

func nullInt32ToPtr(ni sql.NullInt32) *int32 {
	if ni.Valid {
		return &ni.Int32
	}
	return nil
}

func nullTimeToPtr(nt sql.NullTime) *time.Time {
	if nt.Valid {
		return &nt.Time
	}
	return nil
}

// RatedRecipeResponse includes the rating score
type RatedRecipeResponse struct {
	ID          string     `json:"id"`
	UserID      string     `json:"user_id"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Ingredients *string    `json:"ingredients"`
	Steps       *string    `json:"steps"`
	CuisineType *string    `json:"cuisine_type"`
	PrepTime    *int32     `json:"prep_time"`
	PhotoURL    *string    `json:"photo_url"`
	Notes       *string    `json:"notes"`
	CreatedAt   *time.Time `json:"created_at"`
	RatingScore int32      `json:"rating_score"`
}

// ToRatedRecipeResponse converts a sqlc GetRecipesByUserSortedByRatingRow to a clean JSON response
func ToRatedRecipeResponse(r sqlc.GetRecipesByUserSortedByRatingRow) RatedRecipeResponse {
	return RatedRecipeResponse{
		ID:          r.ID,
		UserID:      r.UserID,
		Title:       r.Title,
		Description: nullStringToPtr(r.Description),
		Ingredients: nullStringToPtr(r.Ingredients),
		Steps:       nullStringToPtr(r.Steps),
		CuisineType: nullStringToPtr(r.CuisineType),
		PrepTime:    nullInt32ToPtr(r.PrepTime),
		PhotoURL:    nullStringToPtr(r.PhotoUrl),
		Notes:       nullStringToPtr(r.Notes),
		CreatedAt:   nullTimeToPtr(r.CreatedAt),
		RatingScore: r.RatingScore,
	}
}

// ToRatedRecipeResponses converts a slice to clean JSON responses
func ToRatedRecipeResponses(recipes []sqlc.GetRecipesByUserSortedByRatingRow) []RatedRecipeResponse {
	result := make([]RatedRecipeResponse, len(recipes))
	for i, r := range recipes {
		result[i] = ToRatedRecipeResponse(r)
	}
	return result
}

// PublicRecipeResponse includes user name and average rating for public view
type PublicRecipeResponse struct {
	ID          string     `json:"id"`
	UserID      string     `json:"user_id"`
	UserName    *string    `json:"user_name"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Ingredients *string    `json:"ingredients"`
	Steps       *string    `json:"steps"`
	CuisineType *string    `json:"cuisine_type"`
	PrepTime    *int32     `json:"prep_time"`
	PhotoURL    *string    `json:"photo_url"`
	Notes       *string    `json:"notes"`
	CreatedAt   *time.Time `json:"created_at"`
	AvgRating   float64    `json:"avg_rating"`
}

// ToPublicRecipeResponse converts a sqlc ListAllRecipesRow to a clean JSON response
func ToPublicRecipeResponse(r sqlc.ListAllRecipesRow) PublicRecipeResponse {
	avgRating := 0.0
	if r.AvgRating != nil {
		switch v := r.AvgRating.(type) {
		case float64:
			avgRating = v
		case []byte:
			// MySQL returns DECIMAL as []byte
			var f float64
			_, _ = fmt.Sscanf(string(v), "%f", &f)
			avgRating = f
		}
	}
	return PublicRecipeResponse{
		ID:          r.ID,
		UserID:      r.UserID,
		UserName:    nullStringToPtr(r.UserName),
		Title:       r.Title,
		Description: nullStringToPtr(r.Description),
		Ingredients: nullStringToPtr(r.Ingredients),
		Steps:       nullStringToPtr(r.Steps),
		CuisineType: nullStringToPtr(r.CuisineType),
		PrepTime:    nullInt32ToPtr(r.PrepTime),
		PhotoURL:    nullStringToPtr(r.PhotoUrl),
		Notes:       nullStringToPtr(r.Notes),
		CreatedAt:   nullTimeToPtr(r.CreatedAt),
		AvgRating:   avgRating,
	}
}

// ToPublicRecipeResponses converts a slice to clean JSON responses
func ToPublicRecipeResponses(recipes []sqlc.ListAllRecipesRow) []PublicRecipeResponse {
	result := make([]PublicRecipeResponse, len(recipes))
	for i, r := range recipes {
		result[i] = ToPublicRecipeResponse(r)
	}
	return result
}

// ToPublicRecipeResponseFromSorted converts sorted rows
func ToPublicRecipeResponseFromSorted(r sqlc.ListAllRecipesSortedByRatingRow) PublicRecipeResponse {
	avgRating := 0.0
	if r.AvgRating != nil {
		switch v := r.AvgRating.(type) {
		case float64:
			avgRating = v
		case []byte:
			var f float64
			_, _ = fmt.Sscanf(string(v), "%f", &f)
			avgRating = f
		}
	}
	return PublicRecipeResponse{
		ID:          r.ID,
		UserID:      r.UserID,
		UserName:    nullStringToPtr(r.UserName),
		Title:       r.Title,
		Description: nullStringToPtr(r.Description),
		Ingredients: nullStringToPtr(r.Ingredients),
		Steps:       nullStringToPtr(r.Steps),
		CuisineType: nullStringToPtr(r.CuisineType),
		PrepTime:    nullInt32ToPtr(r.PrepTime),
		PhotoURL:    nullStringToPtr(r.PhotoUrl),
		Notes:       nullStringToPtr(r.Notes),
		CreatedAt:   nullTimeToPtr(r.CreatedAt),
		AvgRating:   avgRating,
	}
}

// ToPublicRecipeResponsesFromSorted converts sorted rows
func ToPublicRecipeResponsesFromSorted(recipes []sqlc.ListAllRecipesSortedByRatingRow) []PublicRecipeResponse {
	result := make([]PublicRecipeResponse, len(recipes))
	for i, r := range recipes {
		result[i] = ToPublicRecipeResponseFromSorted(r)
	}
	return result
}

// ToPublicRecipeResponseFromSingle converts a single public recipe row
func ToPublicRecipeResponseFromSingle(r sqlc.GetRecipeByIDPublicRow) PublicRecipeResponse {
	avgRating := 0.0
	if r.AvgRating != nil {
		switch v := r.AvgRating.(type) {
		case float64:
			avgRating = v
		case []byte:
			var f float64
			_, _ = fmt.Sscanf(string(v), "%f", &f)
			avgRating = f
		}
	}
	return PublicRecipeResponse{
		ID:          r.ID,
		UserID:      r.UserID,
		UserName:    nullStringToPtr(r.UserName),
		Title:       r.Title,
		Description: nullStringToPtr(r.Description),
		Ingredients: nullStringToPtr(r.Ingredients),
		Steps:       nullStringToPtr(r.Steps),
		CuisineType: nullStringToPtr(r.CuisineType),
		PrepTime:    nullInt32ToPtr(r.PrepTime),
		PhotoURL:    nullStringToPtr(r.PhotoUrl),
		Notes:       nullStringToPtr(r.Notes),
		CreatedAt:   nullTimeToPtr(r.CreatedAt),
		AvgRating:   avgRating,
	}
}

// ErrorResponse logs the error and returns a JSON error response
func ErrorResponse(c *gin.Context, status int, message string, err error) {
	if err != nil {
		log.Printf("[ERROR] %s %s: %s - %v",
			c.Request.Method, c.Request.URL.Path, message, err)
	}
	c.JSON(status, gin.H{"error": message})
}

// SuccessResponse logs and returns a success response
func SuccessResponse(c *gin.Context, status int, data interface{}) {
	c.JSON(status, data)
}

// NotFound returns a 404 error
func NotFound(c *gin.Context, resource string) {
	ErrorResponse(c, http.StatusNotFound, resource+" not found", nil)
}

// BadRequest returns a 400 error
func BadRequest(c *gin.Context, err error) {
	ErrorResponse(c, http.StatusBadRequest, err.Error(), err)
}

// InternalError returns a 500 error
func InternalError(c *gin.Context, message string, err error) {
	ErrorResponse(c, http.StatusInternalServerError, message, err)
}
