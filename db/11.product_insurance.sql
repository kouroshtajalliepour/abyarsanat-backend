-- ? product insurance

CREATE TABLE product_insurance (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(200) NOT NULL,

    percentage NUMERIC NOT NULL,
    discounted_percentage NUMERIC NOT NULL,

    CONSTRAINT percentage_min CHECK(0 <= percentage),
    CONSTRAINT percentage_max CHECK(100 >= percentage),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * localization

CREATE TABLE product_insurance_localized_info(
    name VARCHAR(150) NOT NULL,
    id VARCHAR(26) ,
    description VARCHAR(1000) NOT NULL,
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    content JSON,

    CONSTRAINT product_foreign FOREIGN KEY(id) REFERENCES product_insurance(id) ON DELETE CASCADE,

    CONSTRAINT product_insurance_localized_unique UNIQUE
    (
        locale, id
    )
);



-- * triggers
CREATE TRIGGER product_insurance_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_insurance
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_insurance_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_insurance_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();