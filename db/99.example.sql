CREATE TABLE data (
    id VARCHAR(1) DEFAULT 1,
    --  INCASE OF HAVING INDEX NUMBER -> index_number NUMERIC
    -- other basic fields

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE data_localized_info(
    -- localized fields
    
    id VARCHAR(26) NOT NULL,
    locale VARCHAR(20),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

-- * log collection
CREATE TRIGGER data_trigger BEFORE INSERT OR UPDATE OR DELETE ON data
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER data_locale_trigger BEFORE INSERT OR UPDATE OR DELETE ON data_localized_info
    FOR EACH ROW EXECUTE PROCEDURE change_trigger_for_localized_table();