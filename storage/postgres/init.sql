-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Pour la génération d'UUID
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Pour la recherche textuelle
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Pour la gestion des accents

-- Fonction pour la mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "first_name" VARCHAR(50) NOT NULL,               -- Taille raisonnable pour un prénom
    "last_name" VARCHAR(50) NOT NULL,                -- Taille raisonnable pour un nom
    "email" VARCHAR(100) NOT NULL UNIQUE,            -- Standard RFC 5321
    "password_hash" VARCHAR(100) NOT NULL,           -- Suffisant pour les hash modernes
    "phone" VARCHAR(20),                             -- Format international +XX-XXXXXXXXXX
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "valid_date_range" CHECK (end_date IS NULL OR end_date > start_date)
);

-- Table des actions possibles
CREATE TABLE IF NOT EXISTS "actions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50) NOT NULL UNIQUE              -- Noms d'actions concis
);

-- Table des marques
CREATE TABLE IF NOT EXISTS "brands" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE,            -- Noms de marques avec sous-marques possibles
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

-- Trigger pour updated_at des marques
CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON "brands"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Table des contacts de marque
CREATE TABLE IF NOT EXISTS "brand_contacts" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "brand_id" UUID NOT NULL REFERENCES "brands"("id") ON DELETE CASCADE,
    "country" CHAR(2) NOT NULL,                     -- Code pays ISO 3166-1 alpha-2
    "email" VARCHAR(100) NOT NULL,                  -- Standard RFC 5321
    "phone" VARCHAR(20) NOT NULL,                   -- Format international
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("brand_id", "country")                   -- Une marque a un seul contact par pays
);

-- Table des produits
CREATE TABLE IF NOT EXISTS "products" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "reference" VARCHAR(50) NOT NULL UNIQUE,        -- Référence produit standard
    "name" VARCHAR(150) NOT NULL,                   -- Nom produit avec modèle/version
    "short_description" VARCHAR(300),               -- Description courte SEO-friendly
    "description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    "brand_id" UUID NOT NULL REFERENCES "brands"("id"),
    "contact_id" UUID NOT NULL REFERENCES "brand_contacts"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

-- Trigger pour updated_at des produits
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON "products"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Table de l'historique
CREATE TABLE IF NOT EXISTS "history" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id"),
    "action_id" UUID NOT NULL REFERENCES "actions"("id"),
    "product_id" UUID NOT NULL REFERENCES "products"("id"),
    "brand_id" UUID NOT NULL REFERENCES "brands"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des échanges
CREATE TABLE IF NOT EXISTS "exchanges" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id"),
    "brand_id" UUID NOT NULL REFERENCES "brands"("id"),
    "product_id" UUID NOT NULL REFERENCES "products"("id"),
    "message" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,                  -- Statuts courts: new, open, closed, etc.
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP WITH TIME ZONE
);

-- Table des images
CREATE TABLE IF NOT EXISTS "images" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "url" VARCHAR(500) NOT NULL,                    -- URLs longs possibles
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison produits-images
CREATE TABLE IF NOT EXISTS "product_images" (
    "product_id" UUID REFERENCES "products"("id") ON DELETE CASCADE,
    "image_id" UUID REFERENCES "images"("id") ON DELETE CASCADE,
    PRIMARY KEY ("product_id", "image_id")
);

-- Index pour optimiser les performances
CREATE INDEX idx_products_brand ON "products"("brand_id");
CREATE INDEX idx_products_contact ON "products"("contact_id");
CREATE INDEX idx_brand_contacts_brand ON "brand_contacts"("brand_id");
CREATE INDEX idx_brand_contacts_country ON "brand_contacts"("country");
CREATE INDEX idx_history_product ON "history"("product_id");
CREATE INDEX idx_history_user ON "history"("user_id");
CREATE INDEX idx_history_created_at ON "history"("created_at");
CREATE INDEX idx_exchanges_status ON "exchanges"("status");
CREATE INDEX idx_exchanges_created_at ON "exchanges"("created_at");
CREATE INDEX idx_products_reference_trgm ON "products" USING gin (reference gin_trgm_ops);
CREATE INDEX idx_products_name_trgm ON "products" USING gin (name gin_trgm_ops);

-- Quelques actions de base
INSERT INTO "actions" ("name") VALUES
    ('create_product'),
    ('update_product'),
    ('delete_product'),
    ('restore_product'),
    ('change_price'),
    ('update_images'),
    ('update_description')
ON CONFLICT (name) DO NOTHING;

-- Table temporaire pour l'import
CREATE TEMPORARY TABLE temp_import (
    ref VARCHAR(50),
    short_description TEXT,
    description TEXT,
    image_1_src VARCHAR(500),
    image_1_alt VARCHAR(255),
    image_2_src VARCHAR(500),
    image_2_alt VARCHAR(255),
    image_3_src VARCHAR(500),
    image_3_alt VARCHAR(255),
    price DECIMAL(10, 2),
    brand_name VARCHAR(100),
    name VARCHAR(150),
    supplier_country CHAR(2),
    supplier_phone VARCHAR(20),
    supplier_email VARCHAR(100),
    brand_description TEXT
);

-- Import des données du CSV
COPY temp_import FROM '/docker-entrypoint-initdb.d/products.csv' WITH (FORMAT csv, HEADER true);

-- Insertion des marques
WITH unique_brands AS (
    SELECT DISTINCT ON (brand_name)
        brand_name,
        brand_description,
        supplier_country,
        supplier_email,
        supplier_phone
    FROM temp_import
    ORDER BY brand_name
)
INSERT INTO "brands" ("name", "description")
SELECT 
    brand_name,
    brand_description
FROM unique_brands
ON CONFLICT ("name") DO NOTHING;

-- Insertion des contacts de marque
INSERT INTO "brand_contacts" ("brand_id", "country", "email", "phone")
SELECT DISTINCT ON (b.id, ti.supplier_country)
    b.id,
    ti.supplier_country,
    ti.supplier_email,
    ti.supplier_phone
FROM temp_import ti
JOIN brands b ON b.name = ti.brand_name
ON CONFLICT ("brand_id", "country") DO NOTHING;

-- Insertion des produits
INSERT INTO "products" ("reference", "name", "short_description", "description", "price", "brand_id", "contact_id")
SELECT 
    ti.ref,
    ti.name,
    ti.short_description,
    ti.description,
    ti.price,
    b.id as brand_id,
    bc.id as contact_id
FROM temp_import ti
JOIN brands b ON b.name = ti.brand_name
JOIN brand_contacts bc ON bc.brand_id = b.id AND bc.country = ti.supplier_country
ON CONFLICT ("reference") DO UPDATE SET
    "name" = EXCLUDED.name,
    "short_description" = EXCLUDED.short_description,
    "description" = EXCLUDED.description,
    "price" = EXCLUDED.price,
    "updated_at" = CURRENT_TIMESTAMP;

-- Insertion des images
WITH image_data AS (
    SELECT p.id as product_id, img.url
    FROM products p
    JOIN temp_import ti ON p.reference = ti.ref
    CROSS JOIN LATERAL (
        VALUES 
            (ti.image_1_src, true),
            (ti.image_2_src, false),
            (ti.image_3_src, false)
    ) AS img(url, is_primary)
    WHERE img.url IS NOT NULL AND img.url != ''
)
INSERT INTO images ("url", "is_primary")
SELECT DISTINCT url, is_primary
FROM image_data;

-- Création des associations produits-images
INSERT INTO product_images ("product_id", "image_id")
SELECT p.id, i.id
FROM products p
JOIN temp_import ti ON p.reference = ti.ref
JOIN images i ON 
    i.url IN (ti.image_1_src, ti.image_2_src, ti.image_3_src)
WHERE i.url IS NOT NULL AND i.url != '';

-- Nettoyage
DROP TABLE temp_import;