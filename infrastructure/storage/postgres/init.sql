-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Création de la table des marques
CREATE TABLE IF NOT EXISTS "brands" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "country" VARCHAR(255),
    "logo" VARCHAR(255),
    "contactEmail" VARCHAR(255),
    "phone" VARCHAR(20),
    "description" TEXT
);

-- Création de la table des produits
CREATE TABLE IF NOT EXISTS "products" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    "brandId" UUID REFERENCES "brands"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des images
CREATE TABLE IF NOT EXISTS "images" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "url" VARCHAR(255) NOT NULL,
    "altText" VARCHAR(255),
    "isPrimary" BOOLEAN DEFAULT false,
    "productId" UUID REFERENCES "products"("id") ON DELETE CASCADE
);

-- Création de la table des caractéristiques
CREATE TABLE IF NOT EXISTS "characteristics" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "productId" UUID REFERENCES "products"("id") ON DELETE CASCADE
);

-- Création de la table des catégories
CREATE TABLE IF NOT EXISTS "categories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT
);

-- Création de la table des tags
CREATE TABLE IF NOT EXISTS "tags" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT
);

CREATE TABLE IF NOT EXISTS "productsCategories" (
    "productId" UUID REFERENCES "products"("id") ON DELETE CASCADE,
    "categoryId" UUID REFERENCES "categories"("id") ON DELETE CASCADE,
    PRIMARY KEY ("productId", "categoryId")
);

CREATE TABLE IF NOT EXISTS "productsTags" (
    "productId" UUID REFERENCES "products"("id") ON DELETE CASCADE,
    "tagId" UUID REFERENCES "tags"("id") ON DELETE CASCADE,
    PRIMARY KEY ("productId", "tagId")
);


-- Table temporaire pour l'import
CREATE TEMPORARY TABLE temp_import (
    name VARCHAR(255),
    short_description TEXT,
    description TEXT,
    price DECIMAL(10, 2),
    image_1_src VARCHAR(255),
    image_1_alt VARCHAR(255),
    image_2_src VARCHAR(255),
    image_2_alt VARCHAR(255),
    image_3_src VARCHAR(255),
    image_3_alt VARCHAR(255),
    brand_name VARCHAR(255),
    brand_country VARCHAR(255),
    brand_logo VARCHAR(255),
    brand_email VARCHAR(255),
    brand_description TEXT,
    brand_phone VARCHAR(20),
    property_1_label VARCHAR(255),
    property_1_text VARCHAR(255),
    property_2_label VARCHAR(255),
    property_2_text VARCHAR(255),
    property_3_label VARCHAR(255),
    property_3_text VARCHAR(255),
    property_4_label VARCHAR(255),
    property_4_text VARCHAR(255),
    property_5_label VARCHAR(255),
    property_5_text VARCHAR(255)
);

-- Import des données du CSV
COPY temp_import FROM '/docker-entrypoint-initdb.d/products.csv' WITH (FORMAT csv, HEADER true);

-- Insertion des marques
WITH unique_brands AS (
    SELECT DISTINCT ON (brand_name)
        brand_name,
        brand_country,
        brand_logo,
        brand_email,
        brand_description,
        brand_phone
    FROM temp_import
    ORDER BY brand_name, brand_email NULLS LAST
)
INSERT INTO "brands" ("name", "country", "logo", "contactEmail", "description", "phone")
SELECT 
    brand_name,
    brand_country,
    brand_logo,
    brand_email,
    brand_description,
    brand_phone
FROM unique_brands
ON CONFLICT ("name") DO NOTHING;

-- Insertion des produits
INSERT INTO "products" ("name", "shortDescription", "description", "price", "brandId")
SELECT 
    ti.name,
    ti.short_description,
    ti.description,
    ti.price,
    b.id as "brandId"
FROM temp_import ti
JOIN "brands" b ON ti.brand_name = b.name;

-- Insertion des images
INSERT INTO "images" ("url", "altText", "isPrimary", "productId")
SELECT i.url, i.alt_text, i.is_primary, p.id
FROM "products" p
JOIN temp_import ti ON p.name = ti.name 
    AND p."shortDescription" = ti.short_description 
    AND p.description = ti.description
    AND p.price = ti.price
CROSS JOIN LATERAL (
    VALUES 
        (ti.image_1_src, ti.image_1_alt, true),
        (ti.image_2_src, ti.image_2_alt, false),
        (ti.image_3_src, ti.image_3_alt, false)
) AS i(url, alt_text, is_primary)
WHERE i.url IS NOT NULL AND i.url != '';

-- Insertion des caractéristiques
INSERT INTO "characteristics" ("name", "value", "productId")
SELECT c.name, c.value, p.id
FROM "products" p
JOIN temp_import ti ON p.name = ti.name 
    AND p."shortDescription" = ti.short_description 
    AND p.description = ti.description
    AND p.price = ti.price
CROSS JOIN LATERAL (
    VALUES 
        (ti.property_1_label, ti.property_1_text),
        (ti.property_2_label, ti.property_2_text),
        (ti.property_3_label, ti.property_3_text),
        (ti.property_4_label, ti.property_4_text),
        (ti.property_5_label, ti.property_5_text)
) AS c(name, value)
WHERE c.name IS NOT NULL AND c.value IS NOT NULL;

-- Insertion des catégories de base
INSERT INTO "categories" ("name", "description")
VALUES 
    ('Electronics', 'Electronic devices and gadgets'),
    ('Computers', 'Desktop and laptop computers'),
    ('Storage', 'Storage solutions'),
    ('Accessories', 'Computer and electronic accessories')
ON CONFLICT ("name") DO NOTHING;

-- Insertion des tags de base
INSERT INTO "tags" ("name", "description")
VALUES 
    ('New', 'Newly added products'),
    ('Popular', 'Popular items'),
    ('Sale', 'Items on sale'),
    ('Featured', 'Featured products')
ON CONFLICT ("name") DO NOTHING;

-- Association des produits avec les catégories
INSERT INTO "productsCategories" ("productId", "categoryId")
SELECT p.id, c.id
FROM "products" p
CROSS JOIN "categories" c
WHERE c.name IN ('Electronics', 'Computers');

-- Association des produits avec les tags
INSERT INTO "productsTags" ("productId", "tagId")
SELECT p.id, t.id
FROM "products" p
CROSS JOIN "tags" t
WHERE t.name IN ('New', 'Featured');

-- Nettoyage
DROP TABLE temp_import;