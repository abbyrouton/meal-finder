package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method

		// Process request
		c.Next()

		// Log after request completes
		duration := time.Since(start)
		status := c.Writer.Status()
		clientIP := c.ClientIP()

		if status >= 400 {
			log.Printf("[ERROR] %s %s | %d | %v | %s | %s",
				method, path, status, duration, clientIP, c.Errors.String())
		} else {
			log.Printf("[INFO] %s %s | %d | %v | %s",
				method, path, status, duration, clientIP)
		}
	}
}
