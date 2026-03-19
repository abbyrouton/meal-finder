package handlers

import (
	"sync"
	"time"

	"github.com/google/uuid"
)

// MockStore provides in-memory storage for testing without a database
type MockStore struct {
	recipes map[string]*Recipe
	ratings map[string]*Rating // key: "userID:recipeID"
	mu      sync.RWMutex
}

var mockStore *MockStore

func init() {
	mockStore = &MockStore{
		recipes: make(map[string]*Recipe),
		ratings: make(map[string]*Rating),
	}

	// Seed with sample recipes
	seedMockData()
}

func seedMockData() {
	now := time.Now()
	testUserID := "test-user-123"

	recipes := []Recipe{
		{
			ID:          uuid.New().String(),
			UserID:      testUserID,
			Title:       "Spaghetti Carbonara",
			CuisineType: "Italian",
			Ingredients: []string{"spaghetti", "eggs", "pancetta", "parmesan", "black pepper"},
			Steps:       []string{"Boil pasta", "Fry pancetta", "Mix eggs and cheese", "Combine and serve"},
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          uuid.New().String(),
			UserID:      testUserID,
			Title:       "Chicken Tikka Masala",
			CuisineType: "Indian",
			Ingredients: []string{"chicken", "yogurt", "tomatoes", "cream", "garam masala", "rice"},
			Steps:       []string{"Marinate chicken", "Grill chicken", "Make sauce", "Combine and simmer"},
			CreatedAt:   now.Add(-24 * time.Hour),
			UpdatedAt:   now.Add(-24 * time.Hour),
		},
		{
			ID:          uuid.New().String(),
			UserID:      testUserID,
			Title:       "Tacos al Pastor",
			CuisineType: "Mexican",
			Ingredients: []string{"pork", "pineapple", "onion", "cilantro", "corn tortillas"},
			Steps:       []string{"Marinate pork", "Grill with pineapple", "Chop and serve in tortillas"},
			CreatedAt:   now.Add(-48 * time.Hour),
			UpdatedAt:   now.Add(-48 * time.Hour),
		},
	}

	for i := range recipes {
		mockStore.recipes[recipes[i].ID] = &recipes[i]
	}
}

func GetMockStore() *MockStore {
	return mockStore
}

func (m *MockStore) GetRecipes(userID string) []Recipe {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var result []Recipe
	for _, r := range m.recipes {
		if r.UserID == userID {
			result = append(result, *r)
		}
	}
	return result
}

func (m *MockStore) GetRecipe(userID, recipeID string) *Recipe {
	m.mu.RLock()
	defer m.mu.RUnlock()

	r, ok := m.recipes[recipeID]
	if !ok || r.UserID != userID {
		return nil
	}
	return r
}

func (m *MockStore) CreateRecipe(userID string, input CreateRecipeInput) *Recipe {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()
	r := &Recipe{
		ID:          uuid.New().String(),
		UserID:      userID,
		Title:       input.Title,
		CuisineType: input.CuisineType,
		Ingredients: input.Ingredients,
		Steps:       input.Steps,
		PhotoURL:    input.PhotoURL,
		Notes:       input.Notes,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	m.recipes[r.ID] = r
	return r
}

func (m *MockStore) UpdateRecipe(userID, recipeID string, input UpdateRecipeInput) *Recipe {
	m.mu.Lock()
	defer m.mu.Unlock()

	r, ok := m.recipes[recipeID]
	if !ok || r.UserID != userID {
		return nil
	}

	if input.Title != nil {
		r.Title = *input.Title
	}
	if input.CuisineType != nil {
		r.CuisineType = *input.CuisineType
	}
	if input.Ingredients != nil {
		r.Ingredients = input.Ingredients
	}
	if input.Steps != nil {
		r.Steps = input.Steps
	}
	if input.PhotoURL != nil {
		r.PhotoURL = input.PhotoURL
	}
	if input.Notes != nil {
		r.Notes = input.Notes
	}
	r.UpdatedAt = time.Now()

	return r
}

func (m *MockStore) DeleteRecipe(userID, recipeID string) bool {
	m.mu.Lock()
	defer m.mu.Unlock()

	r, ok := m.recipes[recipeID]
	if !ok || r.UserID != userID {
		return false
	}
	delete(m.recipes, recipeID)
	return true
}

func (m *MockStore) UpsertRating(userID, recipeID string, score int, notes *string) *Rating {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Check recipe exists
	r, ok := m.recipes[recipeID]
	if !ok || r.UserID != userID {
		return nil
	}

	key := userID + ":" + recipeID
	now := time.Now()

	if existing, ok := m.ratings[key]; ok {
		existing.Score = score
		existing.Notes = notes
		existing.UpdatedAt = now
		return existing
	}

	rating := &Rating{
		ID:        uuid.New().String(),
		UserID:    userID,
		RecipeID:  recipeID,
		Score:     score,
		Notes:     notes,
		CreatedAt: now,
		UpdatedAt: now,
	}
	m.ratings[key] = rating
	return rating
}

func (m *MockStore) GetSuggestions(userID string) []Suggestion {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var suggestions []Suggestion
	for _, r := range m.recipes {
		if r.UserID == userID {
			suggestions = append(suggestions, Suggestion{
				ID:          r.ID,
				Title:       r.Title,
				CuisineType: r.CuisineType,
				PhotoURL:    r.PhotoURL,
				AvgRating:   0,
			})
		}
	}
	return suggestions
}
