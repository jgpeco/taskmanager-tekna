# backend/entrypoint.sh
#!/bin/sh

echo "Waiting for database..."
sleep 5

echo "Running migrations..."
npx prisma migrate deploy

echo "Running seed..."
npx tsx prisma/seed.ts

echo "Starting server..."
exec node dist/index.js