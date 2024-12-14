-- storage/postgres/migrations/version_control.sql

-- Table pour suivre l'historique des migrations
CREATE TABLE IF NOT EXISTS migrations_history (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER, -- en millisecondes
    status VARCHAR(20) DEFAULT 'success',
    error_message TEXT,
    CONSTRAINT unique_version UNIQUE (version)
);

-- Fonction pour enregistrer l'exécution d'une migration
CREATE OR REPLACE FUNCTION log_migration(
    p_version VARCHAR(50),
    p_name VARCHAR(255),
    p_description TEXT
) RETURNS void AS $$
DECLARE
    start_time TIMESTAMP;
BEGIN
    start_time := clock_timestamp();
    
    INSERT INTO migrations_history (version, name, description)
    VALUES (p_version, p_name, p_description);
    
    -- Met à jour la durée d'exécution
    UPDATE migrations_history
    SET duration = EXTRACT(EPOCH FROM (clock_timestamp() - start_time)) * 1000
    WHERE version = p_version;
    
EXCEPTION WHEN OTHERS THEN
    -- En cas d'erreur, on enregistre l'échec
    INSERT INTO migrations_history (
        version,
        name,
        description,
        status,
        error_message
    ) VALUES (
        p_version,
        p_name,
        p_description,
        'error',
        SQLERRM
    );
    RAISE;
END;
$$ LANGUAGE plpgsql;