CREATE TABLE file (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,

    url VARCHAR(250),
    format VARCHAR(50),
    provider VARCHAR(50),
    size NUMERIC,

    parent_id VARCHAR(26),
    owner_id VARCHAR(26),
    owner_table VARCHAR(50),
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,
    linked_at TIMESTAMP,
    unlinked_at TIMESTAMP,

    CONSTRAINT file_unique UNIQUE (
        slug,
        parent_id,
        owner_id,
        owner_table
    ),

    CONSTRAINT file_foreign FOREIGN KEY(parent_id) REFERENCES file(id) ON DELETE CASCADE
);