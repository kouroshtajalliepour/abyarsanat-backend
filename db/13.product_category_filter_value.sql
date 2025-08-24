-- ? product filter

CREATE TABLE product_category_filter_value (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    serial_id SERIAL NOT NULL UNIQUE,
    index_number NUMERIC,
    slug VARCHAR(100) NOT NULL UNIQUE,

    product_category_id VARCHAR(26) NOT NULL,
    product_category_filter_id VARCHAR(26) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_filter_value_foreign FOREIGN KEY(product_category_filter_id) REFERENCES product_category_filter(id) ON DELETE CASCADE,
    CONSTRAINT product_category_filter_value_unique UNIQUE
    (
        product_category_filter_id, slug
    )
);

-- * localization

CREATE TABLE product_category_filter_value_localized_info(
    name VARCHAR(150) NOT NULL,
    id VARCHAR(26) NOT NULL,
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_filter_value_localized_foreign FOREIGN KEY(id) REFERENCES product_category_filter_value(id) ON DELETE CASCADE,

    CONSTRAINT product_category_filter_value_localized_unique UNIQUE
    (
        locale, id
    )
);

-- * triggers
CREATE TRIGGER product_category_filter_value_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_filter_value
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_category_filter_value_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_filter_value_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();