# backend/entrypoint.sh
#!/bin/sh

echo "Waiting for database..."
sleep 5

echo "Running migrations..."
npx prisma migrate deploy

echo "Running seed..."
npx prisma db seed

echo "Starting server..."
exec node dist/index.js