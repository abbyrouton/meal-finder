package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
