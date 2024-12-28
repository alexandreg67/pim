-- Extensions PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Pour les UUID
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Pour la recherche textuelle
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Pour la gestion des accents

-- Types personnalisés
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'collaborator');

-- Fonction pour la mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction immutable pour unaccent
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
RETURNS text AS $$
SELECT unaccent($1)
$$ LANGUAGE sql IMMUTABLE;

-- Fonction de génération du vecteur de recherche
CREATE OR REPLACE FUNCTION make_searchable_text(name text, reference text)
RETURNS tsvector AS $$
BEGIN
    RETURN (
        setweight(to_tsvector('french', COALESCE(immutable_unaccent(name), '')), 'A') ||
        setweight(to_tsvector('french', COALESCE(reference, '')), 'B')
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction trigger pour la recherche
CREATE OR REPLACE FUNCTION products_search_trigger()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := make_searchable_text(NEW.name, NEW.reference);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "last_name" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "role" user_role NOT NULL DEFAULT 'collaborator',
    "is_first_login" BOOLEAN NOT NULL DEFAULT true,
    "temporary_password" VARCHAR(100),
    "temporary_password_expires" TIMESTAMP WITH TIME ZONE,
    "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "end_date" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "valid_date_range" CHECK (end_date IS NULL OR end_date > start_date)
);

-- Table des marques
CREATE TABLE IF NOT EXISTS "brands" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "logo" VARCHAR(500),
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

-- Contacts de marques
CREATE TABLE IF NOT EXISTS "contacts" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "brand_id" UUID NOT NULL REFERENCES "brands"("id"),
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "country" VARCHAR(100),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_id, country, email)
);

-- Table des produits
CREATE TABLE IF NOT EXISTS "products" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "reference" VARCHAR(50) NOT NULL UNIQUE,
    "name" VARCHAR(150) NOT NULL,
    "short_description" VARCHAR(300),
    "description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "label" VARCHAR(50),
    "brand_id" UUID NOT NULL REFERENCES "brands"("id"),
    "contact_id" UUID NOT NULL REFERENCES "contacts"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "search_vector" tsvector
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS "categories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT
);

-- Table de liaison produits-categories
CREATE TABLE IF NOT EXISTS "products_categories" (
    "product_id" UUID REFERENCES "products"("id") ON DELETE CASCADE,
    "category_id" UUID REFERENCES "categories"("id") ON DELETE CASCADE,
    PRIMARY KEY ("product_id", "category_id")
);

-- Table des tags
CREATE TABLE IF NOT EXISTS "tags" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" TEXT
);

-- Table de liaison produits-tags
CREATE TABLE IF NOT EXISTS "products_tags" (
    "product_id" UUID REFERENCES "products"("id") ON DELETE CASCADE,
    "tag_id" UUID REFERENCES "tags"("id") ON DELETE CASCADE,
    PRIMARY KEY ("product_id", "tag_id")
);

-- Table des images
CREATE TABLE IF NOT EXISTS "images" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "url" VARCHAR(500) NOT NULL UNIQUE,
    "alt_text" VARCHAR(255),
    "is_primary" BOOLEAN NOT NULL DEFAULT false
);

-- Table de liaison produits-images
CREATE TABLE IF NOT EXISTS "product_images" (
    "product_id" UUID REFERENCES "products"("id") ON DELETE CASCADE,
    "image_id" UUID REFERENCES "images"("id") ON DELETE CASCADE,
    PRIMARY KEY ("product_id", "image_id")
);

-- Table des caractéristiques
CREATE TABLE IF NOT EXISTS "characteristic_definitions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE
);

-- Table des valeurs de caractéristiques
CREATE TABLE IF NOT EXISTS "product_characteristics" (
    "id" UUID DEFAULT uuid_generate_v4(),
    "product_id" UUID,
    "characteristic_id" UUID,
    "value" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("product_id", "characteristic_id"),
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE,
    FOREIGN KEY ("characteristic_id") REFERENCES "characteristic_definitions"("id")
);

-- Table des actions
CREATE TABLE IF NOT EXISTS "actions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" TEXT,
    "type" VARCHAR(50) CHECK (type IN ('PRODUCT', 'MEDIA', 'CHARACTERISTIC', 'CATEGORY', 'TAG', 'WORKFLOW')),
    "active" BOOLEAN DEFAULT true
);

-- Table historique
CREATE TABLE IF NOT EXISTS "history" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "action_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "details" JSONB, -- Pour stocker les détails spécifiques de chaque action
    "metadata" JSONB, -- Pour stocker des métadonnées additionnelles
    "ip_address" VARCHAR(45), -- Pour tracer l'origine de l'action
    "user_agent" TEXT, -- Pour identifier le navigateur/appareil
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_history_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    CONSTRAINT "fk_history_action" FOREIGN KEY ("action_id") REFERENCES "actions"("id"),
    CONSTRAINT "fk_history_product" FOREIGN KEY ("product_id") REFERENCES "products"("id")
);

-- Table des échanges
CREATE TABLE IF NOT EXISTS "exchanges" (
    "id" UUID DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "brand_id" UUID,
    "message" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL CHECK (status IN ('new', 'open', 'closed')),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP WITH TIME ZONE,  
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("brand_id") REFERENCES "brands"("id")
);

-- Index et triggers pour optimisation
CREATE INDEX IF NOT EXISTS "idx_products_brand" ON "products"("brand_id");
CREATE INDEX IF NOT EXISTS "idx_products_reference_trgm" ON "products" USING gin (reference gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_products_name_trgm" ON "products" USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_products_search" ON "products" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS "idx_history_user_id" ON "history"("user_id");
CREATE INDEX IF NOT EXISTS "idx_history_product_id" ON "history"("product_id");
CREATE INDEX IF NOT EXISTS "idx_history_created_at" ON "history"("created_at");
CREATE INDEX IF NOT EXISTS "idx_history_action_id" ON "history"("action_id");
CREATE INDEX IF NOT EXISTS "idx_history_details" ON "history" USING gin ("details");
CREATE INDEX IF NOT EXISTS "idx_exchanges_user_id" ON "exchanges"("user_id");
CREATE INDEX IF NOT EXISTS "idx_exchanges_brand_id" ON "exchanges"("brand_id");
CREATE INDEX IF NOT EXISTS "idx_exchanges_status" ON "exchanges"("status");
CREATE INDEX IF NOT EXISTS "idx_product_characteristics_product" ON "product_characteristics"("product_id");
CREATE INDEX IF NOT EXISTS "idx_product_characteristics_characteristic" ON "product_characteristics"("characteristic_id");
CREATE INDEX IF NOT EXISTS "idx_actions_type" ON "actions"("type");
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"(role);


-- Triggers
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON "products"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_search_update
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION products_search_trigger();