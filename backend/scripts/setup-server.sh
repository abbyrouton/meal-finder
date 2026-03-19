#!/bin/bash
# Run this on your Lightsail Ubuntu server to set up the backend

set -e

echo "=== Setting up Meal Finder Backend ==="

# Create app directory
mkdir -p ~/meal-finder-backend
cd ~/meal-finder-backend

# Create .env file (edit with your values)
if [ ! -f .env ]; then
    cat > .env << 'EOF'
PORT=3001
DATABASE_URL=root:YOUR_PASSWORD@tcp(localhost:3306)/meal_finder?parseTime=true
JWT_SECRET=your-secure-jwt-secret-change-this
GIN_MODE=release
EOF
    echo "Created .env file - EDIT IT with your MySQL credentials!"
fi

# Install pm2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "Installing pm2..."
    sudo npm install -g pm2
fi

# Create pm2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'meal-finder-api',
    script: './server',
    env: {
      PORT: 3001,
      GIN_MODE: 'release'
    },
    env_file: '.env',
    watch: false,
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 1000
  }]
}
EOF

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Edit ~/meal-finder-backend/.env with your MySQL credentials"
echo "2. Make sure MySQL is running: sudo systemctl status mysql"
echo "3. Create database: mysql -u root -p -e 'CREATE DATABASE IF NOT EXISTS meal_finder;'"
echo "4. Run migrations: mysql -u root -p meal_finder < migrations/001_init.sql"
echo "5. Deploy will automatically start the server via pm2"
echo ""
