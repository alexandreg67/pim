CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création des roles et permissions
CREATE ROLE pim_app_role;
GRANT ALL PRIVILEGES ON DATABASE pim_db TO pim_app_role;

-- Ajout des extensions utiles pour le PIM
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Pour la recherche texte
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- Pour la gestion des accents
