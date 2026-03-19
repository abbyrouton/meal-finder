package main

import (
	"database/sql"
	"log"
	"os"

	"meal-finder-backend/handlers"
	"meal-finder-backend/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load .env file if it exists
	godotenv.Load()

	// Create Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Get database URL from environment
	databaseURL := os.Getenv("DATABASE_URL")
	var db *sql.DB
	var dbConnected bool

	if databaseURL != "" {
		var err error
		db, err = sql.Open("postgres", databaseURL)
		if err != nil {
			log.Printf("Warning: Failed to connect to database: %v", err)
		} else if err := db.Ping(); err != nil {
			log.Printf("Warning: Failed to ping database: %v", err)
			db = nil
		} else {
			dbConnected = true
			log.Println("Connected to database")
		}
	} else {
		log.Println("Warning: DATABASE_URL not set, running without database")
	}

	if db != nil {
		defer db.Close()
	}

	// Public routes
	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			status := gin.H{
				"status":  "ok",
				"message": "Meal Finder API is running",
			}
			if dbConnected {
				status["database"] = "connected"
				status["mode"] = "production"
			} else {
				status["database"] = "not connected"
				status["mode"] = "mock"
			}
			c.JSON(200, status)
		})
	}

	// Protected routes
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware())

	if db != nil {
		// Production mode: use real database handlers
		recipeHandler := handlers.NewRecipeHandler(db)
		ratingHandler := handlers.NewRatingHandler(db)
		suggestionHandler := handlers.NewSuggestionHandler(db)

		protected.GET("/recipes", recipeHandler.GetRecipes)
		protected.POST("/recipes", recipeHandler.CreateRecipe)
		protected.GET("/recipes/:id", recipeHandler.GetRecipe)
		protected.PUT("/recipes/:id", recipeHandler.UpdateRecipe)
		protected.DELETE("/recipes/:id", recipeHandler.DeleteRecipe)
		protected.POST("/recipes/:id/rating", ratingHandler.CreateRating)
		protected.GET("/suggestions", suggestionHandler.GetSuggestions)
	} else {
		// Mock mode: use in-memory handlers for testing
		log.Println("Running in MOCK mode with test data")
		recipeHandler := handlers.NewMockRecipeHandler()
		ratingHandler := handlers.NewMockRatingHandler()
		suggestionHandler := handlers.NewMockSuggestionHandler()

		protected.GET("/recipes", recipeHandler.GetRecipes)
		protected.POST("/recipes", recipeHandler.CreateRecipe)
		protected.GET("/recipes/:id", recipeHandler.GetRecipe)
		protected.PUT("/recipes/:id", recipeHandler.UpdateRecipe)
		protected.DELETE("/recipes/:id", recipeHandler.DeleteRecipe)
		protected.POST("/recipes/:id/rating", ratingHandler.CreateRating)
		protected.GET("/suggestions", suggestionHandler.GetSuggestions)
	}

	// Get port from environment or default to 3001
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
