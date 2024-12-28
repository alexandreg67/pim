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
    'temporary_password',
    'admin',
    CURRENT_TIMESTAMP,
    true
),
-- Collaborateur de test
(
    'Collaborateur',
    'Test',
    'collaborateur@test.com',
    'temporary_password',
    'collaborator',
    CURRENT_TIMESTAMP,
    true
)
ON CONFLICT (email) DO NOTHING;