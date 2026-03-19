package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Mock handlers for testing without a database

type MockRecipeHandler struct{}

func NewMockRecipeHandler() *MockRecipeHandler {
	return &MockRecipeHandler{}
}

func (h *MockRecipeHandler) GetRecipes(c *gin.Context) {
	userID := c.GetString("userID")
	recipes := GetMockStore().GetRecipes(userID)
	if recipes == nil {
		recipes = []Recipe{}
	}
	c.JSON(http.StatusOK, recipes)
}

func (h *MockRecipeHandler) GetRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	recipe := GetMockStore().GetRecipe(userID, recipeID)
	if recipe == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	c.JSON(http.StatusOK, recipe)
}

func (h *MockRecipeHandler) CreateRecipe(c *gin.Context) {
	userID := c.GetString("userID")

	var input CreateRecipeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recipe := GetMockStore().CreateRecipe(userID, input)
	c.JSON(http.StatusCreated, recipe)
}

func (h *MockRecipeHandler) UpdateRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	var input UpdateRecipeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recipe := GetMockStore().UpdateRecipe(userID, recipeID, input)
	if recipe == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	c.JSON(http.StatusOK, recipe)
}

func (h *MockRecipeHandler) DeleteRecipe(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	if !GetMockStore().DeleteRecipe(userID, recipeID) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Recipe deleted"})
}

type MockRatingHandler struct{}

func NewMockRatingHandler() *MockRatingHandler {
	return &MockRatingHandler{}
}

func (h *MockRatingHandler) CreateRating(c *gin.Context) {
	userID := c.GetString("userID")
	recipeID := c.Param("id")

	var input CreateRatingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rating := GetMockStore().UpsertRating(userID, recipeID, input.Score, input.Notes)
	if rating == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	c.JSON(http.StatusOK, rating)
}

type MockSuggestionHandler struct{}

func NewMockSuggestionHandler() *MockSuggestionHandler {
	return &MockSuggestionHandler{}
}

func (h *MockSuggestionHandler) GetSuggestions(c *gin.Context) {
	userID := c.GetString("userID")
	suggestions := GetMockStore().GetSuggestions(userID)
	if suggestions == nil {
		suggestions = []Suggestion{}
	}
	c.JSON(http.StatusOK, suggestions)
}
