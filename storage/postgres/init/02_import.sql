-- Étape 1 : Création de la table temporaire pour l'import
CREATE TEMPORARY TABLE temp_import (
    ref VARCHAR(255),
    short_description TEXT,
    description TEXT,
    image_1_src VARCHAR(255),
    image_1_alt VARCHAR(255),
    image_2_src VARCHAR(255),
    image_2_alt VARCHAR(255),
    image_3_src VARCHAR(255),
    image_3_alt VARCHAR(255),
    price DECIMAL(10, 2),
    brand_name VARCHAR(255),
    brand_logo VARCHAR(255),
    name VARCHAR(255),
    supplier_country VARCHAR(255),
    supplier_phone TEXT,
    supplier_email VARCHAR(255),
    brand_description TEXT,
    property_1_label VARCHAR(255),
    property_1_text TEXT,
    property_2_label VARCHAR(255),
    property_2_text TEXT,
    property_3_label VARCHAR(255),
    property_3_text TEXT,
    property_4_label VARCHAR(255),
    property_4_text TEXT,
    property_5_label VARCHAR(255),
    property_5_text TEXT
);

-- Étape 2 : Copier les données du CSV dans la table temporaire
COPY temp_import FROM '/docker-entrypoint-initdb.d/products.csv' WITH (FORMAT csv, HEADER true, LIMIT 50);

-- Étape 3 : Supprimer les lignes inutiles
DELETE FROM temp_import 
WHERE ref IS NULL;

-- Étape 4 : Gestion des marques (brands)
INSERT INTO brands (name, logo, description, created_at, updated_at)
SELECT DISTINCT ON (brand_name) 
    brand_name, 
    brand_logo, 
    brand_description,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM temp_import
WHERE brand_name IS NOT NULL
ON CONFLICT (name) DO UPDATE SET 
    logo = EXCLUDED.logo,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

-- Étape 5 : Gestion des produits (products)
INSERT INTO products (reference, name, short_description, description, price, brand_id, created_at, updated_at)
SELECT 
    ti.ref, 
    ti.name, 
    ti.short_description, 
    ti.description, 
    ti.price, 
    b.id AS brand_id, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
FROM temp_import ti
JOIN brands b ON b.name = ti.brand_name
WHERE ti.ref IS NOT NULL
ON CONFLICT (reference) DO UPDATE SET 
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    updated_at = CURRENT_TIMESTAMP;

-- Étape 6 : Gestion des images
WITH image_data AS (
    SELECT 
        p.id AS product_id,
        img.url,
        img.alt_text,
        img.is_primary
    FROM (
        SELECT 
            ti.ref,
            unnest(ARRAY[image_1_src, image_2_src, image_3_src]) AS url,
            unnest(ARRAY[image_1_alt, image_2_alt, image_3_alt]) AS alt_text,
            generate_series(1, 3) = 1 AS is_primary
        FROM temp_import ti
    ) img
    JOIN products p ON p.reference = img.ref
    WHERE img.url IS NOT NULL
)
INSERT INTO images (url, alt_text, is_primary)
SELECT DISTINCT 
    url, 
    alt_text, 
    is_primary
FROM image_data
ON CONFLICT (url) DO NOTHING;

-- Association des images avec les produits
INSERT INTO product_images (product_id, image_id)
SELECT 
    i.product_id, 
    im.id
FROM images im
JOIN (
    SELECT 
        p.id AS product_id,
        unnest(ARRAY[image_1_src, image_2_src, image_3_src]) AS url
    FROM temp_import ti
    JOIN products p ON p.reference = ti.ref
) i ON im.url = i.url
ON CONFLICT (product_id, image_id) DO NOTHING;

-- Gestion des contacts
INSERT INTO contacts (product_id, email, phone, country)
SELECT DISTINCT
    p.id AS product_id,
    ti.supplier_email,
    ti.supplier_phone,
    ti.supplier_country
FROM temp_import ti
JOIN products p ON p.reference = ti.ref
WHERE ti.supplier_email IS NOT NULL
  AND ti.supplier_country IS NOT NULL;

-- Gestion des caractéristiques
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'characteristic_pair'
    ) THEN
        CREATE TYPE characteristic_pair AS (
            label VARCHAR(255),
            value TEXT
        );
    END IF;
END
$$;

-- Étape unique : Insérer définitions et associer caractéristiques aux produits
WITH characteristic_data AS (
    SELECT 
        ti.ref AS product_reference,
        unnest(ARRAY[
            ROW(property_1_label, property_1_text)::characteristic_pair,
            ROW(property_2_label, property_2_text)::characteristic_pair,
            ROW(property_3_label, property_3_text)::characteristic_pair,
            ROW(property_4_label, property_4_text)::characteristic_pair,
            ROW(property_5_label, property_5_text)::characteristic_pair
        ]) AS char_data
    FROM temp_import ti
),
inserted_definitions AS (
    INSERT INTO characteristic_definitions (name)
    SELECT DISTINCT 
        (char_data).label
    FROM characteristic_data
    WHERE (char_data).label IS NOT NULL
    ON CONFLICT (name) DO NOTHING
    RETURNING id, name
)
INSERT INTO product_characteristics (product_id, characteristic_id, value)
SELECT 
    p.id AS product_id,
    cd.id AS characteristic_id,
    (char_data).value
FROM characteristic_data
JOIN products p ON p.reference = characteristic_data.product_reference
JOIN characteristic_definitions cd ON cd.name = (char_data).label
WHERE (char_data).value IS NOT NULL;

-- Étape 9 : Suppression de la table temporaire
DROP TABLE temp_import;