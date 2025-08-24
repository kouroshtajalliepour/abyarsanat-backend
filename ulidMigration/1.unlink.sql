-- ! before


-- * bulk
-- * remove all foreign keys
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT p.conname, c.relname AS tablename  -- Use pg_class.relname to get the table name as text
        FROM pg_constraint p
        JOIN pg_class c ON p.conrelid = c.oid  -- Join pg_constraint with pg_class
        WHERE p.connamespace = 'public'::regnamespace  -- Only for public schema
        AND p.contype = 'f'  -- Only foreign keys
        AND c.relname IN ('_user', 'user_transaction', 'user_address')  -- Only for specific tables
    )
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I CASCADE', r.tablename, r.conname);  -- Use %I for safety
    END LOOP;
END $$;
-- * remove all constraints
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT p.conname, c.relname AS tablename  -- Get constraint name and table name
        FROM pg_constraint p
        JOIN pg_class c ON p.conrelid = c.oid  -- Join to get table names
        WHERE p.connamespace = 'public'::regnamespace  -- Only for public schema
        AND c.relname IN ('_user', 'user_transaction', 'user_address')  -- Only for these tables
    )
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I CASCADE', r.tablename, r.conname);  -- Use %I for safety
    END LOOP;
END $$;
-- * remove all indexes
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT indexname
        FROM pg_indexes 
        WHERE schemaname = 'public'  
        AND tablename IN ('_user', 'user_transaction', 'user_address')  -- Only for these tables
    )
    LOOP
        EXECUTE format('DROP INDEX IF EXISTS %I CASCADE', r.indexname);  -- Use %I for safety
    END LOOP;
END $$;
