ALTER TABLE user_address ADD COLUMN city_id VARCHAR(5);
ALTER TABLE user_address ADD COLUMN province_id VARCHAR(5);
ALTER TABLE user_transaction DROP CONSTRAINT status_check;
ALTER TABLE user_transaction ADD CONSTRAINT status_check CHECK (status IN ('in-process', 'canceled', 'completed', 'packed'));



ALTER TABLE user_transaction ADD COLUMN city_id VARCHAR(5);
ALTER TABLE user_transaction ADD COLUMN province_id VARCHAR(5);
ALTER TABLE user_transaction ADD COLUMN shipment_method VARCHAR(50);
ALTER TABLE user_transaction ADD COLUMN shipment_cost NUMERIC;
ALTER TABLE user_transaction ADD COLUMN total_payed_amount NUMERIC;
ALTER TABLE user_transaction ADD COLUMN payed_shipment_cost NUMERIC;
ALTER TABLE user_transaction ADD COLUMN total_weight NUMERIC;

UPDATE user_transaction SET total_payed_amount = total_promoted_amount;
UPDATE product SET weight = 1000;