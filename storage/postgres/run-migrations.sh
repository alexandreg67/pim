#!/bin/bash

set -e  # Arrête le script si une erreur survient

echo "🚀 Starting database migrations..."

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