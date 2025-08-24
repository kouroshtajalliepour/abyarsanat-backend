CREATE TABLE product_model (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_id VARCHAR(26) NOT NULL,
    slug VARCHAR(100),
    price NUMERIC NOT NULL,
    available_amount NUMERIC NOT NULL,
    image_url VARCHAR(200),
    frozen_amount_in_warehouse NUMERIC NOT NULL,
    -- DEFAULT
    max_amount_purchaseable NUMERIC NOT NULL DEFAULT 99,
    discounted_price NUMERIC NOT NULL,
    soled_amount NUMERIC DEFAULT 0,

    price_is_dynamic BOOLEAN NOT NULL DEFAULT false,

    product_category_id VARCHAR(26) NOT NULL,
    product_brand_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,
    CONSTRAINT index_number_check CHECK(0 <= index_number),
    CONSTRAINT available_amount_check CHECK(available_amount >= frozen_amount_in_warehouse),
    
    product_guaranty_id VARCHAR(26),

    CONSTRAINT product_model_guaranty_id_fk FOREIGN KEY(product_guaranty_id) REFERENCES product_guaranty(id) ON DELETE CASCADE,
    CONSTRAINT product_model_product_fk FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT product_model_product_category_fk FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,
    CONSTRAINT product_model_product_brand_fk FOREIGN KEY(product_brand_id) REFERENCES product_brand(id) ON DELETE CASCADE,

    CONSTRAINT price_min_value CHECK(price >= 0),
    CONSTRAINT discounted_price_min_value CHECK(discounted_price >= 0),

    created_at TIMESTAMP DEFAULT now(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_model_unique UNIQUE
    (
        product_id,
        slug
    )

);

CREATE TABLE product_model_localized_info (
    id VARCHAR(26) NOT NULL,
    name VARCHAR(50),
    
    locale VARCHAR(20),

    created_at TIMESTAMP DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_model_localized_fk FOREIGN KEY(id) REFERENCES product_model(id) ON DELETE CASCADE,
    CONSTRAINT product_model_loc UNIQUE
    (
        locale,
        id
    )
);


-- * log collection

CREATE TABLE product_model_price_log (
    product_model_id VARCHAR(26) NOT NULL,
    price NUMERIC NOT NULL,
    discounted_price NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT product_model_price_log_product_fk FOREIGN KEY(product_model_id) REFERENCES product_model(id) ON DELETE CASCADE
);


-- * FUNCTION

CREATE OR REPLACE FUNCTION change_price_trigger() RETURNS trigger AS $$
    DECLARE
        no_collection text :=  current_setting('app.no_collection', true);
    BEGIN
        IF no_collection IS NULL THEN
            IF TG_OP = 'INSERT' THEN 
                INSERT INTO product_model_price_log (
                    product_model_id,
                    price,
                    discounted_price
                ) VALUES (
                    NEW.id,
                    NEW.price,
                    NEW.discounted_price
                );
                RETURN NEW;
            ELSIF  TG_OP = 'UPDATE' THEN

                IF NEW.discounted_price <> OLD.discounted_price OR NEW.price <> OLD.price THEN
                    INSERT INTO product_model_price_log (
                        product_model_id,
                        price,
                        discounted_price
                    ) VALUES (
                        NEW.id,
                        NEW.price,
                        NEW.discounted_price
                    );
                    RETURN NEW;
                END IF;
                RETURN NEW;
            END IF;
            RETURN NEW;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

-- * TRIGGERS

CREATE TRIGGER product_model_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_model_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();
CREATE TRIGGER product_model_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_model
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_model_price_trigger AFTER INSERT OR UPDATE ON product_model
    FOR EACH ROW EXECUTE PROCEDURE change_price_trigger();

