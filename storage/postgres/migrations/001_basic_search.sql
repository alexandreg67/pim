DO $$
DECLARE
    migration_exists boolean;
BEGIN
    -- Vérifie si la migration existe déjà
    SELECT EXISTS (
        SELECT 1 
        FROM migrations_history 
        WHERE version = '1.0.0'
    ) INTO migration_exists;

    IF NOT migration_exists THEN
        -- Log le début de la migration
        PERFORM log_migration(
            '1.0.0',
            'basic_search',
            'Add basic search functionality to products'
        );

        -- Ajoute l'extension pour la gestion des accents
        CREATE EXTENSION IF NOT EXISTS unaccent;
        
        -- Fonction immutable pour unaccent
        CREATE OR REPLACE FUNCTION immutable_unaccent(text)
        RETURNS text AS
        $func$
        SELECT unaccent($1)
        $func$ LANGUAGE sql IMMUTABLE;

        -- Fonction de génération du vecteur de recherche
        CREATE OR REPLACE FUNCTION make_searchable_text(name text, reference text)
        RETURNS tsvector AS
        $func$
        BEGIN
            RETURN (
                setweight(to_tsvector('french', COALESCE(immutable_unaccent(name), '')), 'A') ||
                setweight(to_tsvector('french', COALESCE(reference, '')), 'B')
            );
        END;
        $func$ LANGUAGE plpgsql IMMUTABLE;

        -- Ajoute la colonne search_vector
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS search_vector tsvector;
        
        -- Crée l'index GIN
        CREATE INDEX IF NOT EXISTS idx_products_search 
        ON products USING GIN (search_vector);

        -- Met à jour les données existantes
        UPDATE products
        SET search_vector = make_searchable_text(name, reference);

        -- Fonction trigger
        CREATE OR REPLACE FUNCTION products_search_trigger()
        RETURNS trigger AS
        $func$
        BEGIN
            NEW.search_vector := make_searchable_text(NEW.name, NEW.reference);
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;

        -- Crée le trigger
        DROP TRIGGER IF EXISTS products_search_update ON products;
        CREATE TRIGGER products_search_update
            BEFORE INSERT OR UPDATE ON products
            FOR EACH ROW
            EXECUTE FUNCTION products_search_trigger();
    END IF;
END;
$$;