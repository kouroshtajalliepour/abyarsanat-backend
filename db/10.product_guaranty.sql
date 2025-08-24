-- ? product guaranty

CREATE TABLE product_guaranty (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * localization

CREATE TABLE product_guaranty_localized_info(
    name VARCHAR(150) NOT NULL,
    id VARCHAR(26) ,
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_guaranty_foreign FOREIGN KEY(id) REFERENCES product_guaranty(id) ON DELETE CASCADE,

    CONSTRAINT product_guaranty_localized_unique UNIQUE
    (
        locale, id
    )
);



-- * triggers
CREATE TRIGGER product_guaranty_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_guaranty
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_guaranty_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_guaranty_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();