-- * admin
CREATE TABLE admin_role (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(200) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);
CREATE TABLE admin_role_access (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    access_group VARCHAR(100) NOT NULL,
    role_id VARCHAR(26),

    CONSTRAINT admin_role_access_fk FOREIGN KEY(role_id) REFERENCES admin_role(id) ON DELETE CASCADE,

    CONSTRAINT admin_role_access_unique UNIQUE
    (
        access_group, role_id
    ),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * localization

CREATE TABLE admin_role_localized_info(
    name VARCHAR(150) NOT NULL,
    id VARCHAR(26),
    description VARCHAR(1000) NOT NULL,
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT blog_foreign FOREIGN KEY(id) REFERENCES admin_role(id) ON DELETE CASCADE,

    CONSTRAINT admin_role_localized_unique UNIQUE
    (
        locale, id
    )
);

CREATE TABLE admin(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    hashed_data VARCHAR(150) NOT NULL,
    image_url VARCHAR(150),
    blocked BOOLEAN,
    confirmed BOOLEAN,
    role_id VARCHAR(26),

    CONSTRAINT admin_role_fk FOREIGN KEY(role_id) REFERENCES admin_role(id) ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- * authentication
CREATE TABLE admin_token(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    admin_id VARCHAR(26),
    platform VARCHAR(150) NOT NULL, 
    blocked BOOLEAN,
    registered_ip VARCHAR(150) NOT NULL,

    CONSTRAINT admin_token_fk FOREIGN KEY(admin_id) REFERENCES admin(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- * triggers
CREATE TRIGGER admin_trigger BEFORE INSERT OR UPDATE OR DELETE ON admin
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER admin_role_trigger BEFORE INSERT OR UPDATE OR DELETE ON admin_role
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER admin_role_localized_trigger BEFORE INSERT OR UPDATE OR DELETE ON admin_role_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();
CREATE TRIGGER admin_role_access BEFORE INSERT OR UPDATE OR DELETE ON admin_role_access
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();