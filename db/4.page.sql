-- for SEO
CREATE TABLE page(
    id VARCHAR(50) NOT NULL PRIMARY KEY
);

INSERT INTO PAGE (id) VALUES ('terms'), ('faq'), ('home'), ('about'), ('contact'), ('blogs');


CREATE TABLE page_localized_info(
    id VARCHAR(50),
    locale VARCHAR(20),
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    tags VARCHAR(100) NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT page_l_fk FOREIGN KEY(id) REFERENCES page(id) ON DELETE CASCADE,

    CONSTRAINT page_localized_unique UNIQUE
    (
        locale, id
    )
);

CREATE TABLE page_slide(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    page_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    index_number NUMERIC NOT NULL,
    url VARCHAR(200) NOT NULL,
    locale VARCHAR(20) NOT NULL,
    image_alt VARCHAR(300) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT page_slide_index_number CHECK(0 <= index_number)
);
CREATE TABLE page_banner(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    page_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    index_number NUMERIC NOT NULL,
    url VARCHAR(200) NOT NULL,
    locale VARCHAR(20) NOT NULL,
    image_alt VARCHAR(300) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT page_banner_index_number CHECK(0 <= index_number)
);

CREATE TABLE info_localized_info(
    id VARCHAR(1) DEFAULT '1',
    locale VARCHAR(20) NOT NULL,
    shipment_description VARCHAR(500) NOT NULL,
    main_banner_url VARCHAR(150),
    main_banner_image_url VARCHAR(150),
    about_content JSON,
    about_primary_image_url VARCHAR(150),
    about_secondary_image_url VARCHAR(150),
    contact_number VARCHAR(150),
    instagram VARCHAR(150),
    telegram VARCHAR(150),
    tweeter VARCHAR(150),
    whats_app VARCHAR(150),
    sale_number VARCHAR(150),
    support_number VARCHAR(150),
    working_hour VARCHAR(150),
    email VARCHAR(150),
    postal_code VARCHAR(150),
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT info_localized_unique UNIQUE
    (
        locale, id
    )
);

CREATE TRIGGER info_locale_trigger BEFORE INSERT OR UPDATE OR DELETE ON info_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();
CREATE TRIGGER page_locale_trigger BEFORE INSERT OR UPDATE OR DELETE ON page_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();
CREATE TRIGGER page_slide_trigger BEFORE INSERT OR UPDATE OR DELETE ON page_slide
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();
CREATE TRIGGER page_banner_trigger BEFORE INSERT OR UPDATE OR DELETE ON page_slide
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();