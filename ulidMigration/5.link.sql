-- ! after : return all indexes and constraints

-- * CHANGE FUNCTION

-- * add single field unique constraints






ALTER TABLE _user ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE _user ADD CONSTRAINT user_phone_number_key UNIQUE (phone_number);
ALTER TABLE user_transaction ADD CONSTRAINT user_transaction_authority_id_key UNIQUE (authority_id);


-- * CHECK CONSTRAINTS

ALTER TABLE user_transaction ADD CONSTRAINT status_check CHECK (status IN ('in-process', 'canceled', 'completed'));

-- FOREIGN KEY CONSTRAINTS

ALTER TABLE user_address ADD CONSTRAINT user_fk FOREIGN KEY(user_id) REFERENCES _user(id) ON DELETE CASCADE;
ALTER TABLE user_transaction ADD CONSTRAINT user_TR_fk FOREIGN KEY(user_id) REFERENCES _user(id) ON DELETE CASCADE;

-- * indexes
CREATE INDEX user_address_user_id_idx ON user_address (user_id);
CREATE INDEX user_address_user_phone_number_idx ON _user (phone_number);
CREATE INDEX user_transaction_user_id_idx ON user_transaction (user_id);