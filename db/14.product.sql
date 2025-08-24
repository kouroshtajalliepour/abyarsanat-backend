CREATE TABLE product (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    pid VARCHAR(100) NOT NULL UNIQUE,
    original_name VARCHAR(150) NOT NULL,

    has_multiple_types BOOLEAN NOT NULL DEFAULT false,
    show_models_as_radio BOOLEAN NOT NULL DEFAULT false,

    product_category_id VARCHAR(26) NOT NULL,
    product_brand_id VARCHAR(26),

    weight NUMERIC,
    x NUMERIC,
    y NUMERIC,
    z NUMERIC,

    published BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT weight_min_value CHECK(weight >= 0),
    CONSTRAINT x_min CHECK(weight >= 0),
    CONSTRAINT y_min CHECK(weight >= 0),
    CONSTRAINT z_min CHECK(weight >= 0),

    CONSTRAINT product_product_category_id_fk FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * gallery

CREATE TABLE product_image(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_id VARCHAR(26) NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_image_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,

    CONSTRAINT index_number_check CHECK(0 <= index_number)
);
CREATE TABLE product_product(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_id VARCHAR(26) NOT NULL,
    related_product_id VARCHAR(26) NOT NULL,
    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_product_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT product_product_rel_foreign FOREIGN KEY(related_product_id) REFERENCES product(id) ON DELETE CASCADE,

    CONSTRAINT index_number_check CHECK(0 <= index_number)
);

-- * filters
CREATE TABLE product_filter(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_id VARCHAR(26) NOT NULL,
    product_category_filter_id VARCHAR(26) NOT NULL,
    product_category_filter_value_id VARCHAR(26),
    product_category_filter_serial_id INTEGER NOT NULL,
    product_category_filter_value_serial_id INTEGER,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_filter_value_product_id_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT product_filter_value_product_category_filter_id_foreign FOREIGN KEY(product_category_filter_id) REFERENCES product_category_filter(id) ON DELETE CASCADE,
    CONSTRAINT product_filter_value_product_category_filter_value_id_foreign FOREIGN KEY(product_category_filter_value_id) REFERENCES product_category_filter_value(id) ON DELETE CASCADE,

    CONSTRAINT product_filter_unique UNIQUE
    (
        product_id,
        product_category_filter_id
    )
);

-- * available insurance
CREATE TABLE product_available_insurance(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_id VARCHAR(26) NOT NULL,
    product_insurance_id VARCHAR(26) NOT NULL,
    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT index_number_check CHECK(0 <= index_number),
    CONSTRAINT product_available_insurance_product_id_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT product_available_insurance_product_insurance_id_foreign FOREIGN KEY(product_insurance_id) REFERENCES product_insurance(id) ON DELETE CASCADE,

    CONSTRAINT product_available_insurance_unique UNIQUE
    (
        product_id,
        product_insurance_id
    )
);

-- * localization
CREATE TABLE product_localized_info(
    name VARCHAR(150) NOT NULL,
    seo_title VARCHAR(100) NOT NULL,
    seo_description VARCHAR(300) NOT NULL,
    tags VARCHAR(100) NOT NULL,
    id VARCHAR(26),
    description VARCHAR(1000) NOT NULL,
    locale VARCHAR(20),

    image_alt VARCHAR(150) NOT NULL,
    price_based_on VARCHAR(50) DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    content JSON,

    CONSTRAINT product_foreign FOREIGN KEY(id) REFERENCES product(id) ON DELETE CASCADE,

    CONSTRAINT product_localized_unique UNIQUE
    (
        locale, id
    )
);

-- * property
CREATE TABLE product_property(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_id VARCHAR(26) NOT NULL,

    selected BOOLEAN NOT NULL DEFAULT false,
    index_number NUMERIC NOT NULL,
    CONSTRAINT index_number_check CHECK(0 <= index_number),


    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_property_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE
);
CREATE TABLE product_property_localized_info(
    id VARCHAR(26),
    key VARCHAR(50) NOT NULL,
    value VARCHAR(150),

    locale VARCHAR(20),

    CONSTRAINT product_property_localized_foreign FOREIGN KEY(id) REFERENCES product_property(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_property_localized_unique UNIQUE
    (
        locale, id
    )
);

alter table product_property_localized_info add column last_modified_at TIMESTAMP,


-- * triggers
CREATE TRIGGER product_image_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_image
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_product_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_product
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_available_insurance_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_available_insurance
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_filter_relation_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_filter
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_trigger BEFORE INSERT OR UPDATE OR DELETE ON product
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();
CREATE TRIGGER product_property_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_property_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();
CREATE TRIGGER product_property_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_property
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();