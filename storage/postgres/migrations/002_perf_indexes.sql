-- Products filtering indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand_id) WHERE deleted_at IS NULL;

-- Many-to-many join tables (assuming names)
CREATE INDEX IF NOT EXISTS idx_products_categories_product ON products_categories (product_id);
CREATE INDEX IF NOT EXISTS idx_products_categories_category ON products_categories (category_id);
CREATE INDEX IF NOT EXISTS idx_products_tags_product ON products_tags (product_id);
CREATE INDEX IF NOT EXISTS idx_products_tags_tag ON products_tags (tag_id);

-- Uniques for slugs/names where applicable
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_brands_name'
  ) THEN
    ALTER TABLE brands ADD CONSTRAINT uq_brands_name UNIQUE (name);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_categories_name'
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT uq_categories_name UNIQUE (name);
  END IF;
END $$;
