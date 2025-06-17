echo "🚀 Starting project setup..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "➡️  Please copy .env.example to .env and update the environment variables."
    exit 1
fi

# Install dependencies
echo "📦 Installing npm packages..."
npm install

# Run Prisma migrate
echo "🧱 Deploying Prisma migrations..."
npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding the database..."
npx prisma db seed

# Optional: run additional seeders
# echo "▶️ Running user seeder..."
# npx ts-node prisma/seeders/user.seed.ts

# Build project
echo "🛠️ Building the project..."
npm run build

# Start the server
echo "🚀 Starting the server..."
npm run start

echo "✅ Setup complete!"