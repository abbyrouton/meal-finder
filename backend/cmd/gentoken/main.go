package main

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "my-secret-key"
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "test-user-123",
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	})

	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(signed)
}
