-- * TABLE

CREATE TABLE log (
    row_id VARCHAR(50),
    created_at timestamp DEFAULT now(),
    table_name VARCHAR(50) NOT NULL,
    operation VARCHAR(50) NOT NULL,
    author VARCHAR(26),
    author_token_id VARCHAR(26),
    author_role VARCHAR(20) NOT NULL,
    author_ip VARCHAR(50) NOT NULL,
    locale VARCHAR(20),
    new_value json,
    old_value json
);

CREATE TABLE visit (
    row_id VARCHAR(50),
    at timestamp DEFAULT now(),
    table_name VARCHAR(50) NOT NULL,
    visitor VARCHAR(26) NOT NULL,
    visitor_role VARCHAR(20) NOT NULL,
    locale VARCHAR(20),
    CONSTRAINT visit_unique UNIQUE (
        row_id,
        visitor
    )
);

-- ! every INSERT, UPDATE or DELETE QUERY on a table that has logging trigger on it must be used in a transaction 
-- ! in every transaction you must use SET LOCALE to set the author's role and author's id like below:
-- ! SET LOCAL app.author_id = ADMIN/USER/TECHNICIAN ID;
-- ! SET LOCAL app.author_role= ADMIN/USER/TECHNICIAN IN A STRING;

-- * CHANGE FUNCTION

CREATE OR REPLACE FUNCTION change_trigger() RETURNS trigger AS $$
    DECLARE
        author_id text := current_setting('app.author_id', true);
        author_role text :=  current_setting('app.author_role', true);
        author_ip text := current_setting('app.author_ip', true);
        author_token_id text :=  current_setting('app.author_token_id', true);
        no_collection text :=  current_setting('app.no_collection', true);
    BEGIN
        IF no_collection IS NULL THEN
            IF TG_OP = 'INSERT' THEN 
                INSERT INTO log (
                    row_id,
                    table_name,
                    operation,
                    author,
                    author_role,
                    author_ip,
                    author_token_id,
                    new_value
                ) VALUES (
                    NEW.id,
                    TG_RELNAME,
                    TG_OP,
                    author_id,
                    author_role,
                    author_ip,
                    author_token_id,
                    row_to_json(NEW)
                );
                RETURN NEW;
            ELSIF  TG_OP = 'UPDATE' THEN
                INSERT INTO log (
                    row_id,
                    table_name,
                    operation,
                    author,
                    author_role,
                    author_ip,
                    author_token_id,
                    new_value,
                    old_value
                ) VALUES (
                    NEW.id,
                    TG_RELNAME,
                    TG_OP,
                    author_id,
                    author_role,
                    author_ip,
                    author_token_id,
                    row_to_json(NEW),
                    row_to_json(OLD)
                );
                RETURN NEW;
            ELSIF TG_OP = 'DELETE' THEN
                INSERT INTO log (
                    row_id,
                    table_name,
                    operation,
                    author,
                    author_role,
                    author_ip,
                    author_token_id,
                    old_value
                ) VALUES (
                    NEW.id,
                    TG_RELNAME,
                    TG_OP,
                    author_id,
                    author_role,
                    author_ip,
                    author_token_id,
                    row_to_json(OLD)
                );
                RETURN OLD;
            END IF;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

CREATE OR REPLACE FUNCTION change_trigger_for_localized_table() RETURNS trigger AS $$
    DECLARE
        author_id text := current_setting('app.author_id', true);
        author_role text := current_setting('app.author_role', true);
        author_ip text := current_setting('app.author_ip', true);
        author_token_id text :=  current_setting('app.author_token_id', true);
        no_collection text :=  current_setting('app.no_collection', true);
    BEGIN
        IF no_collection IS NULL THEN
            IF TG_OP = 'INSERT' THEN 
                INSERT INTO log (
                    row_id,
                    table_name,
                    operation,
                    author,
                    author_role,
                    author_ip,
                    author_token_id,
                    new_value,
                    locale
                ) VALUES (
                    NEW.id,
                    TG_RELNAME,
                    TG_OP,
                    author_id,
                    author_role,
                    author_ip,
                    author_token_id,
                    row_to_json(NEW),
                    NEW.locale
                );
                RETURN NEW;
            ELSIF  TG_OP = 'UPDATE' THEN
                INSERT INTO log (
                    row_id,
                    table_name,
                    operation,
                    author,
                    author_role,
                    author_ip,
                    author_token_id,
                    new_value,
                    old_value,
                    locale
                ) VALUES (
                    NEW.id,
                    TG_RELNAME,
                    TG_OP,
                    author_id,
                    author_role,
                    author_ip,
                    author_token_id,
                    row_to_json(NEW),
                    row_to_json(OLD),
                    NEW.locale
                );
                RETURN NEW;
            ELSIF TG_OP = 'DELETE' THEN
                INSERT INTO log (
                    row_id,
                    table_name,
                    operation,
                    author,
                    author_role,
                    author_ip,
                    author_token_id,
                    old_value,
                    locale
                ) VALUES (
                    NEW.id,
                    TG_RELNAME,
                    TG_OP,
                    author_id,
                    author_role,
                    author_ip,
                    author_token_id,
                    row_to_json(OLD),
                    NEW.locale
                );
                RETURN OLD;
            END IF;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;