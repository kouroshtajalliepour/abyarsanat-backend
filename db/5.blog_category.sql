-- ? blog category

CREATE TABLE blog_category (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(200) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * localization

CREATE TABLE blog_category_localized_info(
    name VARCHAR(150) NOT NULL,
    id VARCHAR(26) ,
    description VARCHAR(1000) NOT NULL,
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT blog_foreign FOREIGN KEY(id) REFERENCES blog_category(id) ON DELETE CASCADE,

    CONSTRAINT blog_category_localized_unique UNIQUE
    (
        locale, id
    )
);

-- * triggers
CREATE TRIGGER blog_category_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog_category
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER blog_category_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog_category_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();