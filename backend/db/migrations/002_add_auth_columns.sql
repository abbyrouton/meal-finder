-- Add authentication columns to users table
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';

-- Create a test user with password "password123"
-- bcrypt hash for "password123": $2a$10$N9qo8uLOickgx2ZMRZoMy.MqOvfg8lXPTdj0Z9kPt7jmFvGvq.qHe
INSERT INTO users (id, email, name, password_hash, role)
VALUES ('test-user-001', 'test@mealfinder.com', 'Test User', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqOvfg8lXPTdj0Z9kPt7jmFvGvq.qHe', 'user')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role);
