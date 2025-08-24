-- ? product brand

CREATE TABLE product_brand (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    serial_id SERIAL NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(200) NOT NULL,

    has_landing_page BOOLEAN DEFAULT false,

    show_best_seller BOOLEAN DEFAULT false,
    show_newest BOOLEAN DEFAULT false,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * localization

CREATE TABLE product_brand_localized_info(
    name VARCHAR(150) NOT NULL,
    id VARCHAR(26) ,
    description VARCHAR(1000) NOT NULL,
    locale VARCHAR(20),
    content JSON,
    seo_title VARCHAR(100),
    image_url VARCHAR(200),
    seo_description VARCHAR(500),
    tags VARCHAR(100) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_foreign FOREIGN KEY(id) REFERENCES product_brand(id) ON DELETE CASCADE,

    CONSTRAINT product_brand_localized_unique UNIQUE
    (
        locale, id
    )
);

CREATE TABLE product_brand_slide(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_brand_id VARCHAR(26) NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    image_alt VARCHAR(300) NOT NULL,
    index_number NUMERIC NOT NULL,
    url VARCHAR(200) NOT NULL,
    locale VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_brand_slide_foreign FOREIGN KEY(product_brand_id) REFERENCES product_brand(id) ON DELETE CASCADE,

    CONSTRAINT product_brand_slide_index_number CHECK(0 <= index_number)
);



-- * triggers
CREATE TRIGGER product_brand_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_brand
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_brand_slider_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_brand_slide
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_brand_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_brand_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();