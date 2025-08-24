-- * blog tag
CREATE TABLE blog_tag (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    icon_url VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);
-- * localization
CREATE TABLE blog_tag_localized_info(
    name VARCHAR(150) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    id VARCHAR(26),
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT blog_tag_localized_foreign FOREIGN KEY(id) REFERENCES blog_tag(id) ON DELETE CASCADE,

    CONSTRAINT blog_tag_localized_unique UNIQUE
    (
        locale, id
    )
);

-- * triggers

CREATE TRIGGER blog_tag_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog_tag
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER blog_tag_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog_tag_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();