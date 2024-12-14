#!/bin/bash

set -e  # Arrête le script si une erreur survient

echo "🚀 Starting database migrations..."

# Démarrage de PostgreSQL en arrière-plan
docker-entrypoint.sh postgres &
PG_PID=$!

# Attendre que PostgreSQL soit prêt
until pg_isready -U postgres; do
    echo "⏳ Waiting for PostgreSQL..."
    sleep 1
done

echo "📦 Initializing version control table..."
psql -U postgres -d pim_db -f /docker-entrypoint-migrations.d/version_control.sql

# Exécute toutes les autres migrations dans l'ordre
for migration in $(ls -v /docker-entrypoint-migrations.d/*.sql | grep -v "version_control.sql"); do
    echo "⚡ Executing migration: $(basename $migration)"
    psql -U postgres -d pim_db -f "$migration"
done

echo "✅ Migrations completed successfully!"

# Attend que le processus PostgreSQL se termine
wait $PG_PID