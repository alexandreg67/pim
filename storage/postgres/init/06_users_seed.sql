-- Création d'une fonction pour hasher les mots de passe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Création des utilisateurs de test
INSERT INTO users (
    first_name,
    last_name,
    email,
    password, -- À remplacer plus tard par un hash
    role,
    start_date,
    is_first_login
) VALUES 
-- Admin de test
(
    'Admin',
    'Test',
    'admin@test.com',
    crypt('admin123', gen_salt('bf')),
    'admin',
    CURRENT_TIMESTAMP,
    true
),
-- Collaborateur de test
(
    'Collaborateur',
    'Test',
    'collaborateur@test.com',
    crypt('collab123', gen_salt('bf')),
    'collaborator',
    CURRENT_TIMESTAMP,
    true
)
ON CONFLICT (email) DO NOTHING;

