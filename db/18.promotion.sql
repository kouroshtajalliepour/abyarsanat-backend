create table promotion (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    max_applicable_price NUMERIC, 
    min_applicable_price NUMERIC NOT NULL DEFAULT 0, 
    max_use NUMERIC NOT NULL, 
    times_used NUMERIC NOT NULL DEFAULT 0,

    discount_price NUMERIC,
    discount_percentage NUMERIC,

    CONSTRAINT min_applicable_price_min_value CHECK(min_applicable_price >= 0),
    CONSTRAINT max_applicable_price_min_value CHECK(max_applicable_price >= 0),
    CONSTRAINT max_use_min_value CHECK(max_use >= 0),
    CONSTRAINT times_used_min_value CHECK(times_used >= 0),
    CONSTRAINT discount_price_min_value CHECK(discount_price >= 0),

    CONSTRAINT discount_percentage_min CHECK(0 <= discount_percentage),
    CONSTRAINT discount_percentage_max CHECK(100 >= discount_percentage),


    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);
CREATE TRIGGER promotion_trigger BEFORE INSERT OR UPDATE OR DELETE ON promotion
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();