-- * product category

CREATE TABLE product_category_suggested_sub_category(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_category_id VARCHAR(26) NOT NULL,
    product_sub_category_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_suggested_sub_category_child_foreign FOREIGN KEY(product_sub_category_id) REFERENCES product_category(id) ON DELETE CASCADE,
    CONSTRAINT product_category_suggested_sub_category_parent_foreign FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_suggested_sub_category_unique UNIQUE
    (
        product_sub_category_id, product_category_id
    )
);
CREATE TABLE product_category_suggested_product(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_category_id VARCHAR(26) NOT NULL,
    product_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_suggested_product_child_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT product_category_suggested_product_parent_foreign FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_suggested_product_unique UNIQUE
    (
        product_id, product_category_id
    )
);
CREATE TABLE product_category_suggested_brand(
    id VARCHAR(26) NOT NULL PRIMARY KEY UNIQUE,
    product_category_id VARCHAR(26) NOT NULL,
    product_brand_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_suggested_brand_child_foreign FOREIGN KEY(product_brand_id) REFERENCES product_brand(id) ON DELETE CASCADE,
    CONSTRAINT product_category_suggested_brand_parent_foreign FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_suggested_brand_unique UNIQUE
    (
        product_brand_id, product_category_id
    )
);
CREATE TABLE product_category_suggested_blog(
    id VARCHAR(26) NOT NULL PRIMARY KEY UNIQUE,
    product_category_id VARCHAR(26) NOT NULL,
    blog_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_suggested_blog_child_foreign FOREIGN KEY(blog_id) REFERENCES blog(id) ON DELETE CASCADE,
    CONSTRAINT product_category_suggested_blog_parent_foreign FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_suggested_blog_unique UNIQUE
    (
        blog_id, product_category_id
    )
);

CREATE TABLE product_category_brand(
    id VARCHAR(26) NOT NULL PRIMARY KEY UNIQUE,
    product_category_id VARCHAR(26) NOT NULL,
    product_brand_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_category_brand_child_foreign FOREIGN KEY(product_brand_id) REFERENCES product_brand(id) ON DELETE CASCADE,
    CONSTRAINT product_category_brand_parent_foreign FOREIGN KEY(product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,

    CONSTRAINT product_category_brand_unique UNIQUE
    (
        product_brand_id, product_category_id
    )
);

-- * product brand

CREATE TABLE product_brand_suggested_product(
    id VARCHAR(26) NOT NULL PRIMARY KEY UNIQUE,
    product_brand_id VARCHAR(26) NOT NULL,
    product_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_brand_suggested_product_child_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT product_brand_suggested_product_parent_foreign FOREIGN KEY(product_brand_id) REFERENCES product_brand(id) ON DELETE CASCADE,

    CONSTRAINT product_brand_suggested_product_unique UNIQUE
    (
        product_id, product_brand_id
    )
);

-- * blog

CREATE TABLE blog_product(
    id VARCHAR(26) NOT NULL PRIMARY KEY UNIQUE,
    product_id VARCHAR(26) NOT NULL,
    blog_id VARCHAR(26) NOT NULL,

    index_number NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT product_suggested_brand_child_foreign FOREIGN KEY(blog_id) REFERENCES blog(id) ON DELETE CASCADE,
    CONSTRAINT product_suggested_brand_parent_foreign FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,

    CONSTRAINT product_suggested_brand_unique UNIQUE
    (
        blog_id, product_id
    )
);

CREATE TRIGGER product_category_suggested_sub_category_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_suggested_sub_category
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_category_suggested_product_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_suggested_product
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_category_suggested_brand_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_suggested_brand
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_category_suggested_blog_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_suggested_blog
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_brand_suggested_product_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_brand_suggested_product
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER blog_product_trigger BEFORE INSERT OR UPDATE OR DELETE ON blog_product
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER product_category_brand_trigger BEFORE INSERT OR UPDATE OR DELETE ON product_category_brand
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();