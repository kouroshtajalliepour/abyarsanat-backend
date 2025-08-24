CREATE TABLE special_offer_product(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_id VARCHAR(26) NOT NULL,
    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT special_offer_product_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,

    CONSTRAINT index_number_check CHECK(0 <= index_number)
);
CREATE TABLE selected_product_brand(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_brand_id VARCHAR(26) NOT NULL,
    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT selected_product_brand_brand_foreign FOREIGN KEY(product_brand_id) REFERENCES product_brand(id) ON DELETE CASCADE,

    CONSTRAINT index_number_check CHECK(0 <= index_number)
);

CREATE TRIGGER special_offer_product_trigger BEFORE INSERT OR UPDATE OR DELETE ON special_offer_product
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER selected_product_brand_trigger BEFORE INSERT OR UPDATE OR DELETE ON selected_product_brand
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();