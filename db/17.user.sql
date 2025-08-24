CREATE TABLE _user(
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(150) UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    otp VARCHAR(6) NOT NULL DEFAULT floor(random() * 1000000 + 1),
    blocked BOOLEAN,
    confirmed BOOLEAN,


    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE user_address (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    province_name VARCHAR(50),
    city_name VARCHAR(50),
    city_id VARCHAR(5),
    province_id VARCHAR(5),
    full_address VARCHAR(300) NOT NULL,
    postal_code VARCHAR(15),
    coordinates VARCHAR(100),
    building_number VARCHAR(15),
    building_unit VARCHAR(15),
    recipient_phone_number VARCHAR(15),
    recipient_first_name VARCHAR(100),
    recipient_last_name VARCHAR(100),
    user_id VARCHAR(26),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT user_fk FOREIGN KEY(user_id) REFERENCES _user(id) ON DELETE CASCADE
);

CREATE TRIGGER user_trigger BEFORE INSERT OR UPDATE OR DELETE ON _user
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER user_address_trigger BEFORE INSERT OR UPDATE OR DELETE ON user_address
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();


CREATE TABLE user_transaction (
    id VARCHAR(26) NOT NULL PRIMARY KEY,

    description VARCHAR(500),

    payment_id SERIAL,
    merchant_id VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    authority_id VARCHAR(100) NOT NULL UNIQUE,
    ref_id VARCHAR(100),
    verified BOOLEAN DEFAULT false,

    total_amount NUMERIC NOT NULL,
    total_discounted_amount NUMERIC NOT NULL,
    total_promoted_amount NUMERIC NOT NULL,
    cart_items JSON NOT NULL,
    cart_number VARCHAR(100),

    status VARCHAR(100) NOT NULL DEFAULT 'in-process' CHECK (status in ('in-process', 'canceled', 'completed', 'packed')), 
    
    user_id VARCHAR(26),
    province_name VARCHAR(50),
    city_id VARCHAR(5),
    province_id VARCHAR(5),
    city_name VARCHAR(50),
    full_address VARCHAR(300) NOT NULL,
    postal_code VARCHAR(15),
    coordinates VARCHAR(100),
    building_number VARCHAR(15),
    building_unit VARCHAR(15),
    recipient_phone_number VARCHAR(15),
    recipient_first_name VARCHAR(100),
    recipient_last_name VARCHAR(100),
    shipment_id VARCHAR(100),

    total_weight NUMERIC NOT NULL,
    shipment_method VARCHAR(50) NOT NULL,
    shipment_cost NUMERIC NOT NULL,
    total_payed_amount NUMERIC NOT NULL,
    payed_shipment_cost NUMERIC NOT NULL,

    promotion_slug VARCHAR(300),
    promotion_discount_price NUMERIC,
    promotion_discount_percentage NUMERIC,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,
    
    CONSTRAINT user_TR_fk FOREIGN KEY(user_id) REFERENCES _user(id) ON DELETE CASCADE
);