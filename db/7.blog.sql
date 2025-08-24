-- * depends on blog-category, user, blog, service
CREATE TABLE blog (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    image_url VARCHAR(200) NOT NULL,
    blog_category_id VARCHAR(26) NOT NULL,
    published BOOLEAN DEFAULT false,
    slug VARCHAR(150) NOT NULL UNIQUE,

    CONSTRAINT blog_foreign FOREIGN KEY(blog_category_id) REFERENCES blog_category(id) ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * localization

CREATE TABLE blog_localized_info(
    title VARCHAR(150) NOT NULL,
    description JSON NOT NULL,
    image_alt VARCHAR(150) NOT NULL,
    answer_description VARCHAR(500),
    intro_description VARCHAR(500),
    content JSON NOT NULL,
    
    id VARCHAR(26) NOT NULL,
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT blog_localized_foreign FOREIGN KEY(id) REFERENCES blog(id) ON DELETE CASCADE,

    CONSTRAINT blog_localized_unique UNIQUE
    (
        locale, id
    )
);

alter table blog_localized_info drop column description;
alter table blog_localized_info add column description JSON;

-- * many-to-many relation to blog tag

CREATE TABLE blog_tag_blog (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    blog_id VARCHAR(26) NOT NULL,
    blog_tag_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT blog_tag_blog_foreign FOREIGN KEY(blog_tag_id) REFERENCES blog_tag(id) ON DELETE CASCADE,
    CONSTRAINT blog_tag_tag_foreign FOREIGN KEY(blog_id) REFERENCES blog(id) ON DELETE CASCADE,

    CONSTRAINT blog_tag_blog_unique UNIQUE
    (
        blog_tag_id, blog_id
    )
);

CREATE TABLE blog_blog(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    blog_id VARCHAR(26) NOT NULL,
    related_blog_id VARCHAR(26) NOT NULL,
    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT blog_blog_foreign FOREIGN KEY(blog_id) REFERENCES blog(id) ON DELETE CASCADE,
    CONSTRAINT blog_blog_rel_foreign FOREIGN KEY(related_blog_id) REFERENCES blog(id) ON DELETE CASCADE,

    CONSTRAINT index_number_check CHECK(0 <= index_number)
);

-- * triggers 
CREATE TRIGGER blog_tag_blog_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog_tag_blog
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER blog_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER blog_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();