CREATE TABLE transaction (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    type VARCHAR(100) NOT NULL DEFAULT 'entrance' CHECK (type in ('entrance', 'exit', 'temporary-exit', 're-entry')),
    open BOOLEAN DEFAULT true,
    fulfilled BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP
);

CREATE TABLE transaction_product (
    id VARCHAR(26) NOT NULL PRIMARY KEY,
    product_model_id VARCHAR(26) NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMP,

    CONSTRAINT amount_check CHECK(0 <= amount),
    CONSTRAINT transaction_product_foreign FOREIGN KEY(product_model_id) REFERENCES product_model(id) ON DELETE CASCADE
);


CREATE TRIGGER transaction_trigger BEFORE INSERT OR UPDATE OR DELETE ON transaction
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();
CREATE TRIGGER transaction_product_trigger BEFORE INSERT OR UPDATE OR DELETE ON transaction_product
    FOR EACH ROW EXECUTE PROCEDURE change_trigger();