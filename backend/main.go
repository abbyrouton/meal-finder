package main

import (
	"database/sql"
	"log"
	"os"

	"meal-finder-backend/handlers"
	"meal-finder-backend/middleware"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists
	godotenv.Load()

	// Create Gin router with custom logging
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.LoggingMiddleware())

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

	// Get database DSN from environment
	// Format: user:password@tcp(host:port)/dbname?parseTime=true
	databaseDSN := os.Getenv("DATABASE_URL")
	var db *sql.DB
	var dbConnected bool

	if databaseDSN != "" {
		var err error
		db, err = sql.Open("mysql", databaseDSN)
		if err != nil {
			log.Printf("Warning: Failed to connect to database: %v", err)
		} else if err := db.Ping(); err != nil {
			log.Printf("Warning: Failed to ping database: %v", err)
			db = nil
		} else {
			dbConnected = true
			log.Println("Connected to MySQL database")
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
				"message": "Meal Finder API v2.0 - Auto-deployed!",
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

		// Auth routes (public)
		if db != nil {
			authHandler := handlers.NewAuthHandler(db)
			api.POST("/login", authHandler.Login)
		}
	}

	// Protected routes
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware())

	if db != nil {
		// Production mode: use sqlc handlers with MySQL
		recipeHandler := handlers.NewSqlcRecipeHandler(db)
		ratingHandler := handlers.NewSqlcRatingHandler(db)
		suggestionHandler := handlers.NewSqlcSuggestionHandler(db)

		protected.GET("/recipes", recipeHandler.GetRecipes)
		protected.POST("/recipes", recipeHandler.CreateRecipe)
		protected.GET("/recipes/:id", recipeHandler.GetRecipe)
		protected.PUT("/recipes/:id", recipeHandler.UpdateRecipe)
		protected.DELETE("/recipes/:id", recipeHandler.DeleteRecipe)
		protected.GET("/recipes/top", recipeHandler.GetRecipesSortedByRating)
		protected.POST("/recipes/:id/rating", ratingHandler.CreateRating)
		protected.DELETE("/recipes/:id/rating", ratingHandler.DeleteRating)
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
