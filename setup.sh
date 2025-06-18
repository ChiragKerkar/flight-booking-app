#!/bin/bash

echo "🚀 Starting project setup..."

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "➡️  Please copy .env.example to .env and configure the environment variables."
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing npm packages..."
npm install

# Run Prisma setup
echo "🧱 Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy

# Seed the database
echo "🌱 Running main database seed..."
npx prisma db seed

# Optional: run additional seeders
if [ -f "prisma/seeders/user.seed.ts" ]; then
    echo "👤 Running user seed..."
    npx ts-node prisma/seeders/user.seed.ts
fi

# Build the project
echo "🛠️ Building the project..."
npm run build

# Start the server in production mode
echo "🚀 Starting the server..."
npm run start

# Uncomment the line below if you're running in development mode instead
# echo "🚧 Starting in development mode..."
# npm run start:dev

echo "✅ Backend setup complete!"

# Frontend instructions
echo ""
echo "🌐 Frontend setup instructions:"
echo "1️⃣ Install the VS Code extension 'Live Server' by Ritwick Dey"
echo "2️⃣ Navigate to the 'frontend' folder"
echo "3️⃣ Right-click on 'index.html' and select 'Open with Live Server'"