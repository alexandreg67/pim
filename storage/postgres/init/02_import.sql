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
COPY temp_import FROM '/docker-entrypoint-initdb.d/products.csv' WITH (FORMAT csv, HEADER true);

-- Étape 3 : Supprimer les lignes inutiles
DELETE FROM temp_import 
WHERE ref IS NULL;

-- Étape 4 : Gestion des marques (brands)
INSERT INTO brands (name, logo, description)
SELECT DISTINCT ON (brand_name) 
    brand_name, 
    brand_logo, 
    brand_description
FROM temp_import
WHERE brand_name IS NOT NULL;

-- Contacts de marques par pays
INSERT INTO contacts (brand_id, country, email, phone)
SELECT DISTINCT ON (b.id, ti.supplier_country, ti.supplier_email)
    b.id,
    ti.supplier_country,
    ti.supplier_email,
    ti.supplier_phone
FROM temp_import ti
JOIN brands b ON b.name = ti.brand_name
WHERE ti.supplier_country IS NOT NULL;

-- Étape 5 : Gestion des produits (products)
INSERT INTO products (reference, name, short_description, description, price, brand_id, contact_id)
SELECT 
    ti.ref, 
    ti.name, 
    ti.short_description, 
    ti.description, 
    ti.price, 
    b.id AS brand_id,
    c.id AS contact_id
FROM temp_import ti
JOIN brands b ON b.name = ti.brand_name
JOIN contacts c ON c.brand_id = b.id 
    AND c.country = ti.supplier_country
    AND c.email = ti.supplier_email;

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

-- Gestion des caractéristiques
-- D'abord, on insère les définitions de caractéristiques
INSERT INTO characteristic_definitions (name)
SELECT DISTINCT property_1_label FROM temp_import WHERE property_1_label IS NOT NULL
UNION
SELECT DISTINCT property_2_label FROM temp_import WHERE property_2_label IS NOT NULL
UNION
SELECT DISTINCT property_3_label FROM temp_import WHERE property_3_label IS NOT NULL
UNION
SELECT DISTINCT property_4_label FROM temp_import WHERE property_4_label IS NOT NULL
UNION
SELECT DISTINCT property_5_label FROM temp_import WHERE property_5_label IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Ensuite, on insère les associations avec les valeurs
-- Caractéristique 1
INSERT INTO product_characteristics (product_id, characteristic_id, value)
SELECT 
    p.id,
    cd.id,
    ti.property_1_text
FROM temp_import ti
JOIN products p ON p.reference = ti.ref
JOIN characteristic_definitions cd ON cd.name = ti.property_1_label
WHERE ti.property_1_label IS NOT NULL AND ti.property_1_text IS NOT NULL;

-- Caractéristique 2
INSERT INTO product_characteristics (product_id, characteristic_id, value)
SELECT 
    p.id,
    cd.id,
    ti.property_2_text
FROM temp_import ti
JOIN products p ON p.reference = ti.ref
JOIN characteristic_definitions cd ON cd.name = ti.property_2_label
WHERE ti.property_2_label IS NOT NULL AND ti.property_2_text IS NOT NULL;

-- Caractéristique 3
INSERT INTO product_characteristics (product_id, characteristic_id, value)
SELECT 
    p.id,
    cd.id,
    ti.property_3_text
FROM temp_import ti
JOIN products p ON p.reference = ti.ref
JOIN characteristic_definitions cd ON cd.name = ti.property_3_label
WHERE ti.property_3_label IS NOT NULL AND ti.property_3_text IS NOT NULL;

-- Caractéristique 4
INSERT INTO product_characteristics (product_id, characteristic_id, value)
SELECT 
    p.id,
    cd.id,
    ti.property_4_text
FROM temp_import ti
JOIN products p ON p.reference = ti.ref
JOIN characteristic_definitions cd ON cd.name = ti.property_4_label
WHERE ti.property_4_label IS NOT NULL AND ti.property_4_text IS NOT NULL;

-- Caractéristique 5
INSERT INTO product_characteristics (product_id, characteristic_id, value)
SELECT 
    p.id,
    cd.id,
    ti.property_5_text
FROM temp_import ti
JOIN products p ON p.reference = ti.ref
JOIN characteristic_definitions cd ON cd.name = ti.property_5_label
WHERE ti.property_5_label IS NOT NULL AND ti.property_5_text IS NOT NULL;

-- Étape 9 : Suppression de la table temporaire
DROP TABLE temp_import;

-- Insertion des catégories
INSERT INTO categories (name, description) VALUES
('Ordinateurs portables', 'Ordinateurs transportables pour tous les usages'),
('Ordinateurs de bureau', 'Ordinateurs fixes pour un usage professionnel ou personnel'),
('Smartphones', 'Téléphones intelligents et accessoires'),
('Tablettes', 'Tablettes tactiles tous formats'),
('Objets connectés', 'Montres, bracelets et autres objets connectés'),
('Audio', 'Casques, écouteurs et enceintes'),
('Composants PC', 'Pièces et composants pour ordinateurs'),
('Périphériques', 'Claviers, souris et autres accessoires informatiques'),
('Gaming', 'Matériel spécialisé pour les jeux vidéo'),
('Réseaux', 'Équipements réseau et connectivité'),
('Mobilier', 'Meubles et articles d''ameublement pour la maison et le bureau'),
('Éclairage', 'Solutions d''éclairage intérieur et extérieur'),
('Textile', 'Articles textiles pour la maison'),
('Décoration', 'Articles décoratifs et accessoires'),
('Cuisine', 'Équipements et ustensiles de cuisine'),
('Salle de bain', 'Accessoires et mobilier de salle de bain'),
('Jardin', 'Mobilier et accessoires d''extérieur'),
('Rangement', 'Solutions de rangement et organisation'),
('Électroménager', 'Appareils électroménagers pour la maison'),
('Bureau', 'Mobilier et accessoires pour espace de travail')
ON CONFLICT (name) DO NOTHING;

-- Insertion des tags
INSERT INTO tags (name, description) VALUES
('Pro', 'Produits destinés aux professionnels'),
('Gaming', 'Produits optimisés pour le jeu'),
('Haute Performance', 'Produits avec des performances supérieures'),
('Compact', 'Produits de petite taille ou ultraportables'),
('5G', 'Compatible avec les réseaux 5G'),
('WiFi 6', 'Compatible avec le standard WiFi 6'),
('Apple', 'Produits de la marque Apple'),
('Windows', 'Produits fonctionnant sous Windows'),
('Android', 'Produits fonctionnant sous Android'),
('Économie d''énergie', 'Produits à faible consommation énergétique'),
('Reconditionné', 'Produits remis à neuf'),
('Stock limité', 'Produits en quantité limitée'),
('Dernière génération', 'Produits de la dernière génération'),
('USB-C', 'Équipé de ports USB-C'),
('RAY TRACING', 'Compatible avec la technologie Ray Tracing'),
('SSD', 'Équipé d''un disque SSD'),
('4K', 'Compatible avec la résolution 4K'),
('Bluetooth 5.0', 'Compatible Bluetooth 5.0'),
('AI Ready', 'Compatible avec les fonctionnalités d''IA'),
('HDR', 'Compatible avec la technologie HDR'),
('Éco-responsable', 'Produits respectueux de l''environnement ou fabriqués avec des matériaux durables'),
('Nouveauté', 'Nouveaux produits ajoutés au catalogue'),
('Promotion', 'Produits actuellement en promotion'),
('Best-seller', 'Produits les plus vendus'),
('Made in France', 'Produits fabriqués en France'),
('Artisanal', 'Produits fabriqués à la main ou de manière artisanale'),
('Sur mesure', 'Produits personnalisables ou sur mesure'),
('Premium', 'Produits haut de gamme'),
('Exclusif', 'Produits en exclusivité'),
('Liquidation', 'Produits en fin de série'),
('Eco-conçu', 'Produits conçus selon des principes écologiques'),
('Connecté', 'Produits avec fonctionnalités connectées'),
('Design', 'Produits au design remarquable'),
('Certifié', 'Produits avec certification qualité')
ON CONFLICT (name) DO NOTHING;