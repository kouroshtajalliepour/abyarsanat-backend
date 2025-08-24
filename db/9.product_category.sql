-- ? product category

CREATE TABLE product_category (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(200) NOT NULL,
    homepage_index NUMERIC,

    has_landing_page BOOLEAN NOT NULL DEFAULT false,

    contains VARCHAR(20) NOT NULL DEFAULT 'product_category' CHECK (contains in ('product', 'product_category')),
    parent_id VARCHAR(26),

    slider_type VARCHAR(20) NOT NULL DEFAULT 'container' CHECK (slider_type in ('container', 'full-screen')),
    show_promoted_products BOOLEAN NOT NULL DEFAULT false,
    show_sub_categories BOOLEAN NOT NULL DEFAULT true,
    show_top_sales BOOLEAN NOT NULL DEFAULT true,
    show_description BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT product_category_parent_fk FOREIGN KEY(parent_id) REFERENCES product_category(id) ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

CREATE TABLE product_category_slide(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_category_id VARCHAR(26) NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    image_alt VARCHAR(300) NOT NULL,
    index_number NUMERIC NOT NULL,
    url VARCHAR(200) NOT NULL,
    locale VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_slide_foreign FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_slide_index_number CHECK(0 <= index_number)
);

-- * localization

CREATE TABLE product_category_localized_info(
    name VARCHAR(150) NOT NULL,
    id VARCHAR(26) ,
    description VARCHAR(1000) NOT NULL,
    locale VARCHAR(20),
    image_url VARCHAR(200),
    seo_title VARCHAR(100),
    tags VARCHAR(100) NOT NULL,
    seo_description VARCHAR(500),
    content JSON,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_foreign FOREIGN KEY(id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_localized_unique UNIQUE
    (
        locale, id
    )
);


alter table product_category_localized_info ALTER COLUMN seo_description TYPE VARCHAR(500);

-- * triggers
CREATE TRIGGER product_category_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_category_slide_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_slide
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_category_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();