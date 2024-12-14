DO $$
BEGIN
    -- Vérifie si la migration n'a pas déjà été appliquée
    IF NOT EXISTS (SELECT 1 FROM migrations_history WHERE version = '1.0.0') THEN
        -- Log le début de la migration
        PERFORM log_migration(
            '1.0.0',
            'basic_search',
            'Add basic search functionality to products'
        );

        -- Ajoute l'extension pour la gestion des accents si elle n'existe pas
        CREATE EXTENSION IF NOT EXISTS unaccent;
        
        -- Ajoute un index simple pour la recherche sur le nom
        CREATE INDEX IF NOT EXISTS idx_products_name_search 
        ON products USING gin (to_tsvector('french', unaccent(name)));
        
        -- Ajoute un index sur la référence
        CREATE INDEX IF NOT EXISTS idx_products_reference_search 
        ON products USING gin (to_tsvector('french', reference));
    END IF;
END $$;