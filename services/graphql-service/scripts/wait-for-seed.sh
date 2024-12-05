#!/bin/bash

# Vérifier que toutes les variables nécessaires sont définies
: "${DB_HOST:?DB_HOST is not set.}"
: "${DB_PORT:?DB_PORT is not set.}"
: "${DB_USERNAME:?DB_USERNAME is not set.}"
: "${DB_PASSWORD:?DB_PASSWORD is not set.}"
: "${DB_DATABASE:?DB_DATABASE is not set.}"

echo "🔍 Waiting for database ($DB_HOST:$DB_PORT) to be ready..."

# Réessayer jusqu'à ce que le seed des données soit terminé
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" -c "SELECT 1 FROM brands LIMIT 1;" > /dev/null 2>&1; do
  echo "⏳ Waiting for seed data..."
  sleep 5
done

echo "✅ Database is ready. Starting application."
exec "$@"