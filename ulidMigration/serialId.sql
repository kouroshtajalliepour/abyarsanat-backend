-- ? product brand

ALTER TABLE product_brand ADD COLUMN serial_id SERIAL NOT NULL UNIQUE;

CREATE TABLE product_category_brand(
    id VARCHAR(26) NOT NULL PRIMARY KEY UNIQUE,
    product_category_id VARCHAR(26) NOT NULL,
    product_brand_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_brand_child_foreign FOREIGN KEY(product_brand_id) REFERENCES product_brand(id) ON DELETE CASCADE,
    CONSTRAINT product_category_brand_parent_foreign FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_brand_unique UNIQUE
    (
        product_brand_id, product_category_id
    )
);
CREATE TRIGGER product_category_brand_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_brand
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();

-- ? product filter
-- * create serial_id field
ALTER TABLE product_category_filter ADD COLUMN serial_id SERIAL NOT NULL UNIQUE;
ALTER TABLE product_category_filter_value ADD COLUMN serial_id SERIAL NOT NULL UNIQUE;
ALTER TABLE product_filter ADD COLUMN product_category_filter_serial_id INTEGER;
ALTER TABLE product_filter ADD COLUMN product_category_filter_value_serial_id INTEGER;

-- * index number for filter tables
ALTER TABLE product_category_filter ADD COLUMN index_number NUMERIC;
ALTER TABLE product_category_filter_value ADD COLUMN index_number NUMERIC;

BEGIN;

SET LOCAL app.no_collection = true;

WITH ranked AS (
    SELECT 
        id, 
        product_category_id, 
        ROW_NUMBER() OVER (PARTITION BY product_category_id ORDER BY index_number) AS new_index
    FROM product_category_filter
)
UPDATE product_category_filter pcf
SET index_number = r.new_index
FROM ranked r
WHERE pcf.id = r.id;
WITH ranked AS (
    SELECT 
        id, 
        product_category_filter_id, 
        ROW_NUMBER() OVER (PARTITION BY product_category_filter_id ORDER BY index_number) AS new_index
    FROM product_category_filter_value
)
UPDATE product_category_filter_value pcfv
SET index_number = r.new_index
FROM ranked r
WHERE pcfv.id = r.id;

COMMIT;

-- * create index

CREATE INDEX idx_product_filter_product_category_filter_serial_id ON product_filter(product_category_filter_serial_id);
CREATE INDEX idx_product_filter_product_category_filter_value_serial_id ON product_filter(product_category_filter_value_serial_id);

-- TODO run script